import { Injectable } from '@nestjs/common';

import { Erc20Config } from '../config/erc20.config';
import { Web3Listener } from '../../web3/listeners/web3.listener';
import { Network } from '../../web3/enums/network';
import { NetWeb3ServiceType } from '../../web3/interfaces/init-web3.type';
import {
  Erc20NetType,
  SubscribeErc20NetType,
} from '../interfaces/subscribe-erc20-net.interface';
import { Erc20MethodInterface } from '../interfaces/erc20-method.interface';
import { QueueErc20 } from '../enums/queue-erc20';

@Injectable()
export class SubscribeService {
  /** Subscribe to web3 witch use this module (contract erc20) */
  public readonly web3!: NetWeb3ServiceType;

  public erc20Methods!: { [key in Network]: Erc20MethodInterface };

  constructor(
    private readonly erc20Config: Erc20Config,
    private readonly web3Listener: Web3Listener,
  ) {
    /** Init web3 for all erc20 contracts (with subscribe to those or not) */
    for (const [net, isSubscribe] of Object.entries(
      this.erc20Config.networks,
    ) as SubscribeErc20NetType) {
      this.web3[net] = this.web3Listener.web3[net];

      this.erc20Methods[net] = this.subscribeToContract(net, isSubscribe);
    }
  }

  protected subscribeToContract(
    net: Erc20NetType,
    isSubscribe = true,
  ): Erc20MethodInterface {
    this.web3Listener.checkQueueEnum(
      this.erc20Config.erc20[net],
      Object.entries(QueueErc20),
    );

    return this.web3Listener.listenContract(
      net,
      this.erc20Config.erc20[net],
      isSubscribe,
    );
  }
}
