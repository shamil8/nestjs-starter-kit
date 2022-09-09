import { Injectable } from '@nestjs/common';

import { ProducerService } from '../../rabbit/services/producer.service';
import { Web3Config } from '../config/web3.config';
import { Network } from '../enums/network';
import { Web3Service } from '../services/web3.service';
import { ContractService } from '../services/contract.service';
import { ParserInfoRepository } from '../repositories/parser-info.repository';
import { ContractWeb3Type } from '../interfaces/contract-web3.interface';

type InitWeb3Type = { [key in Network]: Web3Service };

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

  public listenContract(net: Network, contractConfig: ContractWeb3Type): any {
    const contractWeb3Listener = new ContractService(
      this.web3[net],
      contractConfig[net],
      this.parserRepository,
      this.producerService,
    );

    return contractWeb3Listener.contract.methods;
  }
}
