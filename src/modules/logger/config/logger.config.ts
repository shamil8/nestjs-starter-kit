import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { WinstonDefaultLogLevel } from '../enums/winston-default-log-level';
import { LoggerParamsInterface } from '../interfaces/logger-params.interface';
import config from '../../../config';

@Injectable()
export class LoggerConfig {
  /**
   * Logger arguments
   */
  public readonly loggerParams: LoggerParamsInterface;

  constructor(private readonly configService: ConfigService) {
    this.loggerParams = {
      level: this.configService.get<WinstonDefaultLogLevel>(
        'LOGGER_LEVEL',
        config.server.isDev
          ? WinstonDefaultLogLevel.debug
          : WinstonDefaultLogLevel.info,
      ),
      isRotateLoggerFilesActivated: this.configService.get<boolean>(
        'IS_ROTATE_LOGGER_FILE',
        true,
      ),
      /** log files count */
      loggerMaxFile: this.configService.get<string>('LOGGER_MAX_FILE', '50'),
      loggerMaxSize: this.configService.get<string>(
        'LOGGER_MAX_SIZE',
        // max size '10MB'
        '10000000',
      ),
      loggerName: this.configService
        .get<string>('APP_NAME', 'app-logs')
        .toLowerCase(),
    };
  }
}
