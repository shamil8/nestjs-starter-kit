import { Injectable } from '@nestjs/common';

import { Erc20Config } from '../config/erc20.config';
import { Web3Listener } from '../../web3/listeners/web3.listener';
import { Network } from '../../web3/enums/network';
import { Erc20MethodInterface } from '../interfaces/erc20-method.interface';

@Injectable()
export class SubscribeService {
  public readonly web3Bsc;

  public erc20Methods!: Erc20MethodInterface;

  constructor(
    private readonly erc20Config: Erc20Config,
    private readonly web3Listener: Web3Listener,
  ) {
    this.web3Bsc = this.web3Listener.web3[Network.BSC];

    this.subscribeContracts();
  }

  protected subscribeContracts(): void {
    this.erc20Methods = this.web3Listener.listenContract(
      Network.BSC,
      this.erc20Config.erc20,
    );
  }
}
