import { Injectable } from '@nestjs/common';
import { camelToSnakeCase } from '@app/crypto-utils/functions/core.util';

import { ProducerService } from '../../rabbit/services/producer.service';
import { Web3Config } from '../config/web3.config';
import { Network } from '../enums/network';
import { Web3Service } from '../services/web3.service';
import { ContractService } from '../services/contract.service';
import { ParserInfoRepository } from '../repositories/parser-info.repository';
import {
  ContractInterface,
  ContractWeb3Type,
} from '../interfaces/contract-web3.interface';
import { timeToMs } from '@app/crypto-utils/functions/time.util';

type InitWeb3Type = { [key in Network]: Web3Service };
type QueueNameType = { [key: string]: string };

@Injectable()
export class Web3Listener {
  /** Initialise web3 listeners */
  public readonly web3!: InitWeb3Type;

  constructor(
    private readonly web3Config: Web3Config,
    private readonly parserRepository: ParserInfoRepository,
    private readonly producerService: ProducerService,
  ) {
    this.web3 = this.initListeners();
  }

  protected initListeners(): InitWeb3Type {
    const web3 = {} as InitWeb3Type;

    for (const net of Object.values(Network)) {
      const provider = this.web3Config.providers[net];

      web3[net] = new Web3Service(net, provider, this.web3Config.privateKey);
    }

    return web3;
  }

  public listenContract(net: Network, contractConfig: ContractInterface): any {
    const contractWeb3Listener = new ContractService(
      this.web3[net],
      contractConfig,
      this.parserRepository,
      this.producerService,
    );

    return contractWeb3Listener.contract.methods;
  }

  private getQueueNames(contracts: ContractWeb3Type): QueueNameType {
    const queueNames: QueueNameType = {};

    for (const contractInfo of Object.values(contracts)) {
      const eventNames = contractInfo.abi
        .filter((item) => item.type === 'event' && item.name)
        .map((item) => item.name);

      for (const name of eventNames as string[]) {
        queueNames[name] = `${contractInfo.queuePrefix}.${camelToSnakeCase(
          name,
        )}`;
      }
    }

    return queueNames;
  }

  checkQueueEnum<T>(contracts: ContractWeb3Type, names: [string, T][]): void {
    const queueNames = this.getQueueNames(contracts);

    for (const [key, queue] of names) {
      if (queueNames[key] === String(queue)) {
        delete queueNames[key];
      }
    }

    const stayedNames = Object.entries(queueNames);

    if (!stayedNames.length) {
      return;
    }

    setTimeout(() => {
      console.log(
        '[Web3Listener] you can add Enum for these queues or subscribe:',
        stayedNames.reduce(
          (msg, [key, queue]) => msg + `${key} = '${queue}', \n`,
          '\n',
        ),
      );
    }, timeToMs(2));
  }
}
