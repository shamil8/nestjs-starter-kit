import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { RabbitModule } from '../rabbit/rabbit.module';
import { Web3Config } from './config/web3.config';
import { Erc20Config } from './config/erc20.config';
import { ParserInfoEntity } from './entities/parser-info.entity';
import { ParserInfoRepository } from './repositories/parser-info.repository';
import { InitWeb3Listener } from './listeners/init-web3.listener';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([ParserInfoEntity]),
    RabbitModule,
  ],
  exports: [
    /** web3 initialised listeners */
    InitWeb3Listener,
  ],
  providers: [
    // configs
    Web3Config,
    Erc20Config,

    // repositories
    ParserInfoRepository,

    // listeners
    InitWeb3Listener,
  ],
})
export class Web3Module {}
