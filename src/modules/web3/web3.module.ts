import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { RabbitModule } from '../rabbit/rabbit.module';
import { LoggerModule } from '../logger/logger.module';
import { Web3Config } from './config/web3.config';
import { ParserInfoEntity } from './entities/parser-info.entity';
import { ParserInfoRepository } from './repositories/parser-info.repository';
import { Web3Listener } from './listeners/web3.listener';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    TypeOrmModule.forFeature([ParserInfoEntity]),
    RabbitModule,
  ],
  exports: [
    /** web3 listener */
    Web3Listener,
  ],
  providers: [
    // configs
    Web3Config,

    // repositories
    ParserInfoRepository,

    // listeners
    Web3Listener,
  ],
})
export class Web3Module {}
