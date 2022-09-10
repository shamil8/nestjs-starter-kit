import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';
import { createLogger, Logger as WinstonLogger } from 'winston';

import { LoggerConfig } from '../config/logger.config';
import { winstonTransports } from '../filters/winston.transport';
import { WinstonDefaultLogLevel } from '../enums/winston-default-log-level';

@Injectable()
export class LoggerService extends ConsoleLogger {
  private readonly winstonLogger!: WinstonLogger;

  protected context?: string;

  constructor(private readonly loggerConfig: LoggerConfig) {
    super();
    // TODO:: Move it to config!
    const winstonTransporters = winstonTransports({
      level: WinstonDefaultLogLevel.debug,
      isRotateLoggerFilesActivated: true,
      loggerMaxFile: '250',
      loggerMaxSize: '250',
      loggerName: 'app-without-name',
    });

    this.winstonLogger = createLogger(winstonTransporters);
  }

  /**
   * Write a 'log' level log, if the configured level allows for it.
   * Prints to `stdout` with newline.
   */
  info(
    message: string,
    params: object | any[] = {},
    context = this.context,
  ): void {
    this.winstonLogger.info(message, { context, ...params });
  }

  /**
   * Write an 'error' level log, if the configured level allows for it.
   * Prints to `stderr` with newline.
   */
  error(
    message: string,
    params: object | any[] | string = {},
    context = this.context,
  ): void {
    this.winstonLogger.error(message, {
      context,
      ...(typeof params === 'string' ? { text: params } : params),
    });
  }

  /**
   * Write a 'warn' level log, if the configured level allows for it.
   * Prints to `stdout` with newline.
   */
  warn(
    message: string,
    params: object | any[] | string = {},
    context = this.context,
  ): void {
    this.winstonLogger.warn(message, {
      context,
      ...(typeof params === 'string' ? { text: params } : params),
    });
  }

  /**
   * Write a 'debug' level log, if the configured level allows for it.
   * Prints to `stdout` with newline.
   */
  debug(
    message: string,
    params: object | any[] | string = {},
    context = this.context,
  ): void {
    this.winstonLogger.debug(message, {
      context,
      ...(typeof params === 'string' ? { text: params } : params),
    });
  }

  /**
   * Write a 'verbose' level log, if the configured level allows for it.
   * Prints to `stdout` with newline.
   */
  verbose(
    message: string,
    params: object | any[] | string = {},
    context = this.context,
  ): void {
    this.winstonLogger.verbose(message, {
      context,
      ...(typeof params === 'string' ? { text: params } : params),
    });
  }

  /**
   * Set log levels
   * @param levels log levels
   */
  setLogLevels(levels: LogLevel[]): void {
    super.setLogLevels(levels);
  }

  setContext(context: string): void {
    super.setContext(context);

    this.context = context;
  }
}
