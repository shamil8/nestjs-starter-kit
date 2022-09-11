import { Injectable } from '@nestjs/common';
import { TransactionReceipt } from 'web3-core';
import BigNumber from 'bignumber.js';

import { LoggerService } from '../../logger/services/logger.service';
import { SubscribeService } from './subscribe.service';

@Injectable()
export class Erc20Service {
  constructor(
    private readonly logger: LoggerService,
    private readonly subscribeService: SubscribeService,
  ) {
    this.transfer('0x83b625a83f109b6dc753accfe737c62475fd2285', 1);
  }
  async transfer(
    recipient: string,
    amount: number,
  ): Promise<TransactionReceipt | null> {
    const decimals = await this.subscribeService.erc20Methods.decimals().call();

    const amountStr = new BigNumber(amount).shiftedBy(+decimals).toString();

    const transaction = this.subscribeService.erc20Methods.transfer(
      recipient,
      amountStr,
    );

    this.logger.log('getDecimals', { decimals });
    return null;
    // return this.subscribeService.web3Bsc.sendTransaction(transaction);
  }
}
