import { ConsoleLogger, Inject, Injectable, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';

import { WinstonService } from './winston.service';
import { ErrorLoggerInterface } from '../interfaces/error-logger.interface';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  protected context?: string;

  constructor(
    private readonly winstonService: WinstonService,
    @Inject(INQUIRER) context?: string | object,
  ) {
    super();

    this.context =
      typeof context === 'string' ? context : context?.constructor?.name;
  }

  /**
   * Write a 'log' level log, if the configured level allows for it.
   * Prints to `stdout` with newline.
   */
  log(
    message: string,
    params: object | any[] | string = {},
    context = this.context,
  ): void {
    this.winstonService.logger.info(message, {
      context,
      ...(typeof params === 'string' ? { text: params } : params),
    });
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
    this.winstonService.logger.info(message, { context, ...params });
  }

  /**
   * Write an 'error' level log, if the configured level allows for it.
   * Prints to `stderr` with newline.
   */
  error(
    message: string,
    params: object | ErrorLoggerInterface | any[] | string = {},
    context = this.context,
  ): void {
    this.winstonService.logger.error(message, {
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
    this.winstonService.logger.warn(message, {
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
    this.winstonService.logger.debug(message, {
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
    this.winstonService.logger.verbose(message, {
      context,
      ...(typeof params === 'string' ? { text: params } : params),
    });
  }

  setContext(context: string): void {
    super.setContext(context);

    this.context = context;
  }
}
