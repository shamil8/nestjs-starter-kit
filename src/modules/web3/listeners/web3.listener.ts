import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { BlockTransactionString } from 'web3-eth';
import { Contract } from 'web3-eth-contract';
import { Transaction, Sign, TransactionReceipt, BlockNumber } from 'web3-core';
import { WebsocketProviderOptions } from 'web3-core-helpers';

import { extensionFormatter } from '../formatters/extension.formatter';
import { ProviderInterface } from '../interfaces/provider-web3.interface';
import { ContractMethodInterface } from '../interfaces/contract-method.interface';
import { TransactionJobInterface } from '../interfaces/transaction-job.interface';
import { ProducerService } from '../../rabbit/services/producer.service';
import { Network } from '../enums/network';

export class Web3Listener {
  protected websocketOptions: WebsocketProviderOptions = {
    clientConfig: {
      maxReceivedFrameSize: 100000000,
      maxReceivedMessageSize: 100000000,
    },
    reconnect: {
      auto: true,
      // delay set to `ms`
      delay: 5000,
      maxAttempts: 15,
      onTimeout: false,
    },
  };

  protected web3!: Web3;

  /** Blockchain max count blocks */
  public readonly parseLimit: number;

  constructor(
    public readonly net: Network,
    private readonly provider: ProviderInterface,
    protected readonly privateKey?: string,
  ) {
    this.parseLimit = provider.parseLimit;

    this.initWeb3(provider.url);
  }

  protected initWeb3(provider: string): void {
    const providerWS = this.hasHttp(provider)
      ? new Web3.providers.HttpProvider(provider)
      : new Web3.providers.WebsocketProvider(provider, this.websocketOptions);

    this.web3 = new Web3(providerWS);

    /** Extends web3 methods */
    this.web3.extend(extensionFormatter);

    if (!this.privateKey) {
      return;
    }

    /** web3 with account for sending transaction */
    const account = this.web3.eth.accounts.privateKeyToAccount(this.privateKey);
    this.web3.eth.accounts.wallet.add(account);
    this.web3.eth.defaultAccount = account.address;

    console.log(
      '\x1b[32m%s\x1b[0m',
      '[Web3Listener] initWeb3 net',
      this.net,
      'account:',
      account.address,
    );
  }

  async netSubscribe(
    producer: ProducerService,
    queueName: string,
    addresses: Set<string>,
  ): Promise<void> {
    const lastBlockNum = await this.getBlockNumber('netSubscribe');
    console.log(
      'Web3Listener: lastBlockNumber',
      lastBlockNum,
      `from net ${this.net}`,
    );

    let tmpBlockNumber: number;

    this.web3.eth.subscribe(
      'logs',
      { fromBlock: 'latest' },
      async (error, res) => {
        if (tmpBlockNumber === res.blockNumber) {
          return;
        }

        if (error) {
          console.error('[Web3Listener]: errorRes', error);
        }

        tmpBlockNumber = res.blockNumber;

        const transaction = await this.getTransaction(res.transactionHash);

        if (!transaction) {
          return;
        }

        let walletAddress;

        if (addresses.has(transaction.from)) {
          walletAddress = transaction.from;
        } else if (transaction.to && addresses.has(transaction.to)) {
          walletAddress = transaction.to;
        }

        if (!walletAddress) {
          return;
        }

        const queueData: TransactionJobInterface = {
          ...transaction,
          walletAddress,
        };

        await producer.addMessage(queueName, queueData);
      },
    );
  }

  async getBlock(blockNumber: BlockNumber): Promise<BlockTransactionString> {
    return this.web3.eth.getBlock(blockNumber);
  }

  async getTransaction(transactionHash: string): Promise<Transaction> {
    return this.web3.eth.getTransaction(transactionHash);
  }

  createContract(Abi: AbiItem[], address: string): Contract {
    return new this.web3.eth.Contract(Abi, address);
  }

  async getBlockNumber(exceptionMessage = 'Error'): Promise<number | null> {
    try {
      return this.web3.eth.getBlockNumber();
    } catch (e: any) {
      console.error(
        `[${exceptionMessage}]: getBlockNumber from net ${this.net}`,
        `provider: ${this.getProvider()}`,
        e,
      );

      return null;
    }
  }

  async getUserBalance(address: string, isWei = false): Promise<string> {
    const balance = await this.web3.eth.getBalance(address);

    return isWei ? this.web3.utils.fromWei(balance) : balance;
  }

  getAccountAddress(): string {
    return this.web3.eth.accounts.wallet[0].address;
  }

  async getGasPrice(): Promise<string> {
    const price = await this.web3.eth.getGasPrice();

    return this.web3.utils.toHex(price);
  }

  createSignature(data: string[]): Sign | null {
    const sha3 = this.web3.utils.soliditySha3(...data);

    if (!sha3 || !this.privateKey) {
      return null;
    }

    return this.web3.eth.accounts.sign(sha3, this.privateKey);
  }

  getProvider(): string {
    const provider = this.web3.currentProvider as unknown as {
      host: string;
      url?: string;
    };

    return provider.url || provider.host;
  }

  isHttpProvider(): boolean {
    return this.hasHttp(this.getProvider());
  }

  private hasHttp(url: string): boolean {
    return url.includes('https') || url.includes('http');
  }

  isUserSign(address: string, sign: string): boolean {
    try {
      const message = this.web3.utils.utf8ToHex(address);
      const addressFromSign = this.web3.eth.accounts
        .recover(message, sign)
        .toLowerCase();

      return addressFromSign === address;
    } catch (e: any) {
      return false;
    }
  }

  async sendTransaction(
    transaction: ContractMethodInterface,
  ): Promise<TransactionReceipt> {
    const from = this.getAccountAddress();

    const gas = await transaction.estimateGas({ from });

    console.log(
      `[Web3Listener] gasPrice for method '${transaction._method.name}' :`,
      gas,
    );

    return transaction.send({ from, gas });
  }
}
