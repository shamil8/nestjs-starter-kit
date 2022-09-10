import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonDefaultLogLevel } from '../enums/winston-default-log-level';
import { LoggerParamsInterface } from '../interfaces/logger-params.interface';

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
        WinstonDefaultLogLevel.info,
      ),
      isRotateLoggerFilesActivated: this.configService.get<boolean>(
        'IS_ROTATE_LOGGER_FILES_ACTIVATED',
        true,
      ),
      loggerMaxFile: this.configService.get<string>('LOGGER_MAX_FILES', '250'),
      loggerMaxSize: this.configService.get<string>('LOGGER_MAX_SIZE', '250'),
      loggerName: this.configService.get<string>(
        'APP_NAME',
        'app-without-name',
      ),
    };
  }
}
