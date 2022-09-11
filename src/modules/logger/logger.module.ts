import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LoggerConfig } from './config/logger.config';
import { WinstonService } from './services/winston.service';
import { LoggerService } from './services/logger.service';

@Module({
  imports: [ConfigModule],
  providers: [
    // configs
    LoggerConfig,

    // services
    WinstonService,
    LoggerService,
  ],
  exports: [LoggerService],
})
export class LoggerModule {}
