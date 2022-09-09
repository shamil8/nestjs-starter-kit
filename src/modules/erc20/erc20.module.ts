import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RabbitModule } from '../rabbit/rabbit.module';
import { Web3Module } from '../web3/web3.module';
import { Erc20Config } from './config/erc20.config';
import { SubscribeService } from './services/subscribe.service';
import { Erc20Service } from './services/erc20.service';
import { ApproveJob } from './jobs/approve.job';

@Module({
  imports: [ConfigModule, RabbitModule, Web3Module],
  providers: [
    // configs
    Erc20Config,

    // services
    SubscribeService,
    Erc20Service,

    // jobs
    ApproveJob,
  ],
})
export class Erc20Module {}
