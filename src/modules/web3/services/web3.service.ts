import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { BlockTransactionString } from 'web3-eth';
import { Contract } from 'web3-eth-contract';
import { Transaction, Sign, TransactionReceipt, BlockNumber } from 'web3-core';
import { WebsocketProviderOptions } from 'web3-core-helpers';

import { extensionFormatter } from '../formatters/extension.formatter';
import { ProviderInterface } from '../interfaces/provider-web3.interface';
import { TransactionMethodInterface } from '../interfaces/contract-method.interface';
import { TransactionJobInterface } from '../interfaces/transaction-job.interface';
import { LoggerService } from '../../logger/services/logger.service';
import { ProducerService } from '../../rabbit/services/producer.service';
import { Network } from '../enums/network';

export class Web3Service {
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
    public readonly logger: LoggerService,
    public readonly net: Network,
    private readonly provider: ProviderInterface,
    protected readonly privateKey?: string,
  ) {
    this.parseLimit = provider.parseLimit;

    this.logger.setContext(`${Web3Service.name}__${this.net}`);
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

    this.logger.verbose('Init web3 net', { account: account.address });
  }

  async netSubscribe(
    producer: ProducerService,
    queueName: string,
    addresses: Set<string>,
  ): Promise<void> {
    const lastBlockNum = await this.getBlockNumber(this.netSubscribe.name);
    this.logger.warn('Get lastBlockNumber', { lastBlockNum });

    let tmpBlockNumber: number;

    this.web3.eth.subscribe(
      'logs',
      { fromBlock: 'latest' },
      async (error, res) => {
        if (tmpBlockNumber === res.blockNumber) {
          return;
        }

        if (error) {
          this.logger.error('Error, subscribe errorRes', {
            stack: this.netSubscribe.name,
            extra: error,
            net: this.net,
          });
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

  async getBlockNumber(stack = 'Error'): Promise<number | null> {
    try {
      return this.web3.eth.getBlockNumber();
    } catch (e: any) {
      this.logger.error(`Error ${this.getBlockNumber.name}`, {
        stack,
        provider: this.getProvider(),
        extra: e,
      });

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
    transaction: TransactionMethodInterface,
  ): Promise<TransactionReceipt | null> {
    try {
      const from = this.getAccountAddress();

      const gas = await transaction.estimateGas({ from });

      this.logger.log(`gasPrice for method '${transaction._method.name}'`, {
        gas,
      });

      return transaction.send({ from, gas });
    } catch (e: any) {
      this.logger.error('Error, estimate gas price', {
        stack: this.sendTransaction.name,
        extra: e,
        net: this.net,
      });

      return null;
    }
  }
}
