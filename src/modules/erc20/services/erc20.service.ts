import { Injectable } from '@nestjs/common';
import { TransactionReceipt } from 'web3-core';
import BigNumber from 'bignumber.js';

import { LoggerService } from '../../logger/services/logger.service';
import { SubscribeService } from './subscribe.service';
import { Web3Service } from '../../web3/services/web3.service';
import { Erc20NetType } from '../interfaces/subscribe-erc20-net.interface';
import { Erc20MethodInterface } from '../interfaces/erc20-method.interface';
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
    // example
    this.setNet(Network.BSC);
    this.getAmountWithDecimals('220');
  }

  /** Set net if not exist */
  setNet(net: Erc20NetType): void {
    if (this.net !== net) {
      this.net = net;
      this.web3 = this.subscribeService.web3[net];
      this.methods = this.subscribeService.erc20Methods[net];
    }
  }

  async getAmountWithDecimals(amount: number | string): Promise<string> {
    const decimals = await this.methods.decimals().call();

    this.logger.log('getDecimals from erc20', { net: this.net, decimals });

    return new BigNumber(amount).shiftedBy(+decimals).toString();
  }

  async transfer(
    recipient: string,
    amount: number,
  ): Promise<TransactionReceipt | null> {
    const amountStr = await this.getAmountWithDecimals(amount);

    const transaction = this.methods.transfer(recipient, amountStr);

    return this.web3.sendTransaction(transaction);
  }
}
