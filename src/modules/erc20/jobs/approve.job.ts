import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

import { QueueErc20 } from '../enums/queue-erc20';
import { ApprovalJobInterface } from '../interfaces/approval-job.interface';
import { Erc20Service } from '../services/erc20.service';

@Injectable()
export class ApproveJob {
  constructor(private readonly erc20Service: Erc20Service) {}

  @RabbitSubscribe({
    exchange: '',
    queue: QueueErc20.Approval,
  })
  public async handler(data: ApprovalJobInterface): Promise<void> {
    const spender = data.returnValues.spender.toLowerCase();
    const owner = data.returnValues.owner.toLowerCase();
    const amount = 500;

    console.log('[ApproveJob] spender', spender);
    console.log('[ApproveJob] owner', owner);

    await this.erc20Service.transfer(spender, amount);
  }
}
