import { Contract } from 'web3-eth-contract';
import { camelToSnakeCase } from '@app/crypto-utils/functions/core.util';
import { sleepTimeout, timeToMs } from '@app/crypto-utils/functions/time.util';

import { Web3Service } from './web3.service';
import { ParserInfoRepository } from '../repositories/parser-info.repository';
import { ContractInterface } from '../interfaces/contract-web3.interface';
import { ProducerService } from '../../rabbit/services/producer.service';
import { ErrorLoggerInterface } from '../../logger/interfaces/error-logger.interface';
import { EventDataInterface } from '../interfaces/event-data.interface';
import {
  EventCallbackType,
  ParseEventInterface,
} from '../interfaces/parse-event.interface';
import { JobInterface } from '../interfaces/job.interface';

export class ContractService {
  /** sleep timeout for retry 15 seconds */
  private readonly sleepTime = timeToMs(15, 'second');

  /** contract from blockchain */
  public readonly contract!: Contract;

  /** parse interval time */
  private readonly parseIntervalTime!: number;

  protected readonly logOptions = {
    net: this.web3.net,
    context: ContractService.name,
  };

  constructor(
    /** web3 service */
    private readonly web3: Web3Service,
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
  }

  errorOptions(extra: any, stack: string): ErrorLoggerInterface {
    return {
      ...this.logOptions,
      provider: this.web3.getProvider(),
      address: this.contractInfo.address,
      extra,
      stack,
    };
  }

  async subscribeToContract(): Promise<void> {
    try {
      this.web3.logger.warn('Subscribed in contract:', {
        address: this.contractInfo.address,
        ...this.logOptions,
      });

      if (!this.web3.isHttpProvider()) {
        await this.subscribeAllEvents(this.eventCallback.bind(this));
      }

      this.parseEventsLoop(this.eventCallback.bind(this));
    } catch (e: any) {
      this.web3.logger.error(
        'Can not call web3 method with provider:',
        this.errorOptions(e, this.subscribeToContract.name),
      );
    }
  }

  async eventCallback(data: EventDataInterface, isWs = true): Promise<void> {
    if (!data.event) {
      this.web3.logger.error(
        'Event data without event name, transactionHash:',
        {
          ...this.errorOptions('Error', this.eventCallback.name),
          transactionHash: data.transactionHash,
        },
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

    await this.producerService.addMessage<JobInterface>(queueName, {
      ...data,
      isWs,
      net: this.web3.net,
    });
  }

  async subscribeAllEvents(callback: EventCallbackType): Promise<void> {
    try {
      const fromBlock = (await this.web3.getBlockNumber()) || 0;

      this.contract.events
        .allEvents({ fromBlock }, (err: any) => {
          if (err) {
            this.web3.logger.error(
              'Error allEvents:',
              this.errorOptions(err, this.subscribeAllEvents.name),
            );

            this.subscribeAllEvents(callback);
          }
        })
        .on('data', callback)
        .on('error', (err: any) => {
          this.web3.logger.error(
            'Error eventError:',
            this.errorOptions(err, this.subscribeAllEvents.name),
          );

          this.subscribeAllEvents(callback);
        });
    } catch (e: any) {
      this.web3.logger.error(
        `Error in ${this.subscribeAllEvents.name}:`,
        this.errorOptions(e, this.subscribeAllEvents.name),
      );
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

    this.web3.logger.log(`${this.parseEvents.name} lastBlockNumber`, {
      latest,
      ...this.logOptions,
    });

    for (
      let toBlock = fromBlock + limit;
      toBlock <= latest + limit;
      toBlock += limit
    ) {
      const options = {
        fromBlock,
        toBlock: toBlock <= latest ? toBlock : latest,
      };

      this.web3.logger.warn(`Parse from ${this.parseEvents.name}:`, {
        options,
        ...this.logOptions,
      });

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
      } catch (e: any) {
        this.web3.logger.error(
          'Error starting timeout:',
          this.errorOptions(e, this.parseEvents.name),
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
      } catch (e: any) {
        this.web3.logger.error(
          'Error parse events loop:',
          this.errorOptions(e, this.parseEventsLoop.name),
        );
      }
    }
  }
}
