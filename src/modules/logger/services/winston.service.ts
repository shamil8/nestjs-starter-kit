import { Injectable } from '@nestjs/common';
import { join } from 'path';
import {
  createLogger,
  format,
  Logger as WinstonLogger,
  transport,
  transports,
} from 'winston';
import { WinstonModuleOptions } from 'nest-winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston/dist/winston.utilities';
import WinstonDailyRotateFile from 'winston-daily-rotate-file';

import { LoggerConfig } from '../config/logger.config';
import { ParamsLoggerInterface } from '../interfaces/params-logger.interface';

@Injectable()
export class WinstonService {
  public readonly logger!: WinstonLogger;

  constructor(private readonly loggerConfig: LoggerConfig) {
    const winstonTransporters = this.winstonTransports(
      loggerConfig.loggerParams,
    );

    this.logger = createLogger(winstonTransporters);
  }

  winstonTransports(params: ParamsLoggerInterface): WinstonModuleOptions {
    const formatOptions = {
      format: format.combine(
        format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike(),
      ),
      level: params.level,
    };

    // TODO: Add your transport for PLG/EFK stack
    const transporters: transport[] = [new transports.Console(formatOptions)];
    const exceptionHandlers: any[] = [];
    const logsDirectory = join(__dirname, '..', '..', '..', 'logs');
    const defaultLogsDirectoryPath = join(
      logsDirectory,
      params.loggerName,
      'default',
    );
    const exceptionsLogsDirectoryPath = join(
      logsDirectory,
      params.loggerName,
      'exception',
    );

    if (params.isRotateLoggerFile) {
      const rotateOptions = {
        ...formatOptions,
        filename: `%DATE%.log`,
        dirname: defaultLogsDirectoryPath,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: params.loggerMaxSize,
        maxFiles: params.loggerMaxFile,
      };

      const winstonDailyRotateFile = new WinstonDailyRotateFile(rotateOptions);
      const winstonDailyRotateFileExceptionHandlers =
        new WinstonDailyRotateFile({
          ...rotateOptions,
          dirname: exceptionsLogsDirectoryPath,
        });

      transporters.push(winstonDailyRotateFile);
      exceptionHandlers.push(winstonDailyRotateFileExceptionHandlers);
    } else {
      const fileTransports = new transports.File({
        ...formatOptions,
        filename: 'app.log',
        dirname: defaultLogsDirectoryPath,
      });
      const fileExceptionHandler = new transports.File({
        ...formatOptions,
        filename: 'app.exceptions.log',
        dirname: exceptionsLogsDirectoryPath,
      });

      transporters.push(fileTransports);
      exceptionHandlers.push(fileExceptionHandler);
    }

    return {
      format: format.combine(format.timestamp()),
      transports: transporters,
      // Handling Uncaught Exceptions with winston
      handleExceptions: true,
      exitOnError: false,
      exceptionHandlers,
    };
  }
}
