import { Injectable } from '@nestjs/common';
import { TransactionReceipt } from 'web3-core';
import BigNumber from 'bignumber.js';

import { LoggerService } from '../../logger/services/logger.service';
import { SubscribeService } from './subscribe.service';
import { Network } from '../../web3/enums/network';
import { Erc20NetType } from '../interfaces/subscribe-erc20-net.interface';

@Injectable()
export class Erc20Service {
  constructor(
    private readonly logger: LoggerService,
    private readonly subscribeService: SubscribeService,
  ) {
    this.transfer('0x83b625a83f109b6dc753accfe737c62475fd2285', 1, Network.BSC);
  }
  async transfer(
    recipient: string,
    amount: number,
    net: Erc20NetType,
  ): Promise<TransactionReceipt | null> {
    const decimals = await this.subscribeService.erc20Methods[net]
      .decimals()
      .call();

    const amountStr = new BigNumber(amount).shiftedBy(+decimals).toString();

    const transaction = this.subscribeService.erc20Methods[net].transfer(
      recipient,
      amountStr,
    );

    this.logger.log('getDecimals from erc20', { net, decimals });

    return this.subscribeService.web3[net].sendTransaction(transaction);
  }
}
