import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { LoggerModule } from '../logger/logger.module';
import { databaseConfig } from './config/database.config';
import { LoggerService } from '../logger/services/logger.service';
import { DatabaseLoggerService } from './services/database-logger.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, LoggerModule],
      inject: [ConfigService, LoggerService],
      useFactory: (config: ConfigService, logger: LoggerService) => ({
        ...databaseConfig(config),
        logger: new DatabaseLoggerService(logger),
      }),
    }),
  ],
})
export class DatabaseModule {}
