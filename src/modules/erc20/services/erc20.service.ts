import { Injectable } from '@nestjs/common';
import { TransactionReceipt } from 'web3-core';
import { BigNumber } from '@app/crypto-utils/functions/export-settings';

import { LoggerService } from '../../logger/services/logger.service';
import { Web3Service } from '../../web3/services/web3.service';
import { SubscribeService } from './subscribe.service';
import { Erc20NetType } from '../interfaces/erc20-subscribe.interface';
import { Erc20MethodInterface } from '../interfaces/erc20-methods/erc20-method.interface';
import { Network } from '../../web3/enums/network';

@Injectable()
export class Erc20Service {
  public net!: Erc20NetType;
  public web3!: Web3Service;
  public methods!: Erc20MethodInterface;

  constructor(
    private readonly logger: LoggerService,
    private readonly subscribeService: SubscribeService,
  ) {
    setTimeout(this.getExample.bind(this), 5000);
  }

  /** Set net if not exist */
  setNet(net: Erc20NetType): void {
    if (this.net !== net) {
      this.net = net;
      this.web3 = this.subscribeService.web3[net];
      this.methods = this.subscribeService.erc20Methods[net];
    }
  }

  async getExample(): Promise<void> {
    this.setNet(Network.BSC);
    const decimals = await this.getDecimals();

    console.log('exampleee', decimals);
  }

  async getDecimals(): Promise<string> {
    return this.methods.decimals().call();
  }

  async transfer(
    recipient: string,
    amount: number,
  ): Promise<TransactionReceipt | null> {
    const decimals = await this.getDecimals();

    this.logger.log(`${this.getDecimals.name} from erc20`, {
      net: this.net,
      decimals,
    });

    const amountStr = BigNumber(amount)
      .shiftedBy(+decimals)
      .toString();

    const transaction = this.methods.transfer(recipient, amountStr);

    return this.web3.sendTransaction(transaction);
  }
}
