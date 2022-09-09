import { Injectable } from '@nestjs/common';

import { ProducerService } from '../../rabbit/services/producer.service';
import { Web3Config } from '../config/web3.config';
import { Erc20Config } from '../config/erc20.config';
import { Network } from '../enums/network';
import { Web3Listener } from './web3.listener';
import { ContractWeb3Listener } from './contract-web3.listener';
import { ParserInfoRepository } from '../repositories/parser-info.repository';
import { ContractMethodType } from '../interfaces/contract-method.interface';

type InitWeb3Type = { [key in Network]: Web3Listener };

@Injectable()
export class InitWeb3Listener {
  /** Initialise web3 listeners */
  public readonly web3!: InitWeb3Type;

  /** contract from blockchain */
  public erc20Methods!: ContractMethodType;

  constructor(
    private readonly web3Config: Web3Config,
    private readonly erc20Config: Erc20Config,
    private readonly parserRepository: ParserInfoRepository,
    private readonly producerService: ProducerService,
  ) {
    this.web3 = this.initListeners();

    this.initContracts();
  }

  private initListeners(): InitWeb3Type {
    const web3 = {} as InitWeb3Type;

    for (const net of Object.values(Network)) {
      const provider = this.web3Config.providers[net];

      web3[net] = new Web3Listener(net, provider, this.web3Config.privateKey);
    }

    return web3;
  }

  private async initContracts(): Promise<void> {
    /** Init example Erc20 USDT contract */
    const net = Network.BSC;

    const contractWeb3Listener = new ContractWeb3Listener(
      this.web3[net],
      this.erc20Config.erc20[net],
      this.parserRepository,
      this.producerService,
    );

    this.erc20Methods = contractWeb3Listener.contract.methods;
  }
}
