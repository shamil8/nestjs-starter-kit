import { Contract } from 'web3-eth-contract';
import { camelToSnakeCase } from '@app/crypto-utils/functions/core.util';
import { sleepTimeout, timeToMs } from '@app/crypto-utils/functions/time.util';

import { Web3Listener } from './web3.listener';
import { ParserInfoRepository } from '../repositories/parser-info.repository';
import { ContractInterface } from '../interfaces/contract-web3.interface';
import { ProducerService } from '../../rabbit/services/producer.service';
import { EventDataInterface } from '../interfaces/event-data.interface';
import {
  EventCallbackType,
  ParseEventInterface,
} from '../interfaces/parse-event.interface';

export class ContractWeb3Listener {
  /** sleep timeout for retry 15 seconds */
  private readonly sleepTime = timeToMs(15, 'second');

  /** contract from blockchain */
  public readonly contract!: Contract;

  /** parse interval time */
  private readonly parseIntervalTime!: number;

  constructor(
    /** web3 listener */
    private readonly web3: Web3Listener,
    /** contract info */
    private readonly contractInfo: ContractInterface,
    /** parser info repository */
    private readonly parserRepository: ParserInfoRepository,

    /** parser info repository */
    private readonly producerService: ProducerService,
  ) {
    this.contract = this.web3.createContract(
      this.contractInfo.abi,
      this.contractInfo.address,
    );

    this.parseIntervalTime = timeToMs(
      this.web3.isHttpProvider() ? 5 : 60,
      'minute',
    );

    this.subscribeToContract();
  }

  async subscribeToContract(): Promise<void> {
    try {
      console.log(
        '\x1b[36m%s\x1b[0m',
        `[ContractWeb3Listener] Subscribed | net: '${this.web3.net}' | contract: ${this.contractInfo.address}.`,
      );

      if (!this.web3.isHttpProvider()) {
        await this.subscribeAllEvents(this.eventCallback.bind(this));
      }

      this.parseEventsLoop(this.eventCallback.bind(this));
    } catch (e) {
      console.error(
        `[ContractWeb3Listener] Can not call web3 method with provider: ${this.web3.getProvider()}`,
        e,
      );
    }
  }

  async eventCallback(data: EventDataInterface, isWs = true): Promise<void> {
    if (!data.event) {
      console.error(
        '[ContractWeb3Listener] Event data without event name, transactionHash:',
        data.transactionHash,
      );

      return;
    }

    /** Removing unnecessary fields */
    delete data.raw;
    delete data.blockHash;
    delete data.transactionIndex;
    delete data.logIndex;
    delete data.removed;
    delete data.id;

    for (const [key] of Object.entries(data.returnValues)) {
      if (!Number.isNaN(Number(key))) {
        delete data.returnValues[key];
      }
    }

    /** Sending to broker */
    const queueName = `${this.contractInfo.queuePrefix}.${camelToSnakeCase(
      data.event,
    )}`;

    await this.producerService.addMessage(queueName, { ...data, isWs });
  }

  async subscribeAllEvents(callback: EventCallbackType): Promise<void> {
    try {
      const fromBlock = (await this.web3.getBlockNumber()) || 0;

      this.contract.events
        .allEvents({ fromBlock }, (err: any) => {
          if (err) {
            console.error(
              '[ContractWeb3Listener] subscribeAllEvents allEvents:',
              err,
            );
            this.subscribeAllEvents(callback);
          }
        })
        .on('data', callback)
        .on('error', (err: any) => {
          console.error(
            '[ContractWeb3Listener] subscribeAllEvents eventError:',
            err,
          );

          this.subscribeAllEvents(callback);
        });
    } catch (e) {
      console.error('[ContractWeb3Listener] subscribeAllEvents Error:', e);
    }
  }

  async parseEvents(payload: ParseEventInterface): Promise<void> {
    const limit = this.web3.parseLimit;
    const latest = await this.web3.getBlockNumber('parseEvents');

    if (!latest) {
      await sleepTimeout(this.sleepTime);
      await this.parseEvents(payload);

      return;
    }

    let { fromBlock } = payload;
    let events = this.contractInfo.events;

    console.log('[ContractWeb3Listener] parseEvents lastBlockNumber', latest);

    for (
      let toBlock = fromBlock + limit;
      toBlock <= latest + limit;
      toBlock += limit
    ) {
      const options = {
        fromBlock,
        toBlock: toBlock <= latest ? toBlock : latest,
      };

      console.log(
        '\x1b[35m%s\x1b[0m',
        `[ContractWeb3Listener] Parse '${this.web3.net}': `,
        options,
      );

      !events && (events = ['allEvents']);

      if (fromBlock >= options.toBlock) {
        return;
      }

      try {
        for (const event of events) {
          const items = await this.contract.getPastEvents(event, options);

          for (const item of items) {
            // isWS = false meant doesn't need to send socket event!
            await payload.parseCallback(item, this.web3.isHttpProvider());
          }
        }

        await this.parserRepository.storeParserInfo({
          lastBlock: String(options.toBlock),
          net: this.web3.net,
          address: this.contractInfo.address,
        });
      } catch (e) {
        console.error(
          `[ContractWeb3Listener] parseEvents starting timeout, provider: ${this.web3.getProvider()}`,
          e,
        );

        await sleepTimeout(this.sleepTime);
        await this.parseEvents(payload); // repeat if got error
      }

      fromBlock = toBlock;
    }
  }

  async parseEventsLoop(parseCallback: EventCallbackType): Promise<void> {
    while (this.parseIntervalTime) {
      // Parsing events
      try {
        const parserInfo = await this.parserRepository.getParserInfo({
          lastBlock: String(this.contractInfo.firstBlock),
          net: this.web3.net,
          address: this.contractInfo.address,
        });

        await this.parseEvents({
          fromBlock: Number(parserInfo.lastBlock) + 1,
          parseCallback,
        });

        await sleepTimeout(this.parseIntervalTime);
      } catch (e) {
        console.error('[ContractWeb3Listener]', e);
      }
    }
  }
}
