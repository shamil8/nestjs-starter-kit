import { Injectable } from '@nestjs/common';
import { LoggerConfig } from '../config/logger.config';
import { winstonTransports } from '../filters/winston.transport';
import { createLogger, Logger as WinstonLogger } from 'winston';

@Injectable()
export class WinstonService {
  public readonly logger!: WinstonLogger;

  constructor(private readonly loggerConfig: LoggerConfig) {
    const winstonTransporters = winstonTransports(loggerConfig.loggerParams);

    this.logger = createLogger(winstonTransporters);
  }
}
