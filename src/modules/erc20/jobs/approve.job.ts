import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

import { QueueErc20 } from '../enums/queue-erc20';
import { ApprovalJobInterface } from '../interfaces/approval-job.interface';
import { Erc20Service } from '../services/erc20.service';
import { LoggerService } from '../../logger/services/logger.service';

@Injectable()
export class ApproveJob {
  constructor(
    private readonly logger: LoggerService,
    private readonly erc20Service: Erc20Service,
  ) {}

  @RabbitSubscribe({
    exchange: '',
    queue: QueueErc20.Approval,
  })
  public async handler(data: ApprovalJobInterface): Promise<void> {
    const spender = data.returnValues.spender.toLowerCase();
    const owner = data.returnValues.owner.toLowerCase();
    const amount = 500;

    this.logger.log('spender', spender);
    this.logger.log('owner', owner);

    await this.erc20Service.transfer(spender, amount);
  }
}
