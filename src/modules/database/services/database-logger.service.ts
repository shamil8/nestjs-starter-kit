import { Logger } from 'typeorm';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';

import { LoggerService } from '../../logger/services/logger.service';

export class DatabaseLoggerService implements Logger {
  /** We set context for logger because we use typeOrm! */
  public readonly context = DatabaseLoggerService.name;

  constructor(private readonly logger: LoggerService) {}

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): void {
    this.logger.verbose(query, { parameters, context: this.context });
  }

  logQueryError(error: string, query: string, parameters?: any[]): void {
    this.logger.error(query, {
      query,
      parameters,
      extra: error,
      stack: this.logQueryError.name,
      context: this.context,
    });
  }

  logQuerySlow(time: number, query: string, parameters?: any[]): void {
    this.logger.warn('Slow query:', {
      time,
      query,
      parameters,
      stack: this.logQuerySlow.name,
      context: this.context,
    });
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner): void {
    this.logger.info(message, {
      stack: this.logSchemaBuild.name,
      context: this.context,
    });
  }

  logMigration(message: string, queryRunner?: QueryRunner): void {
    this.logger.verbose(message, {
      stack: this.logMigration.name,
      context: this.context,
    });
  }

  log(level: 'log' | 'info' | 'warn', message: any): void {
    switch (level) {
      case 'log':
        this.logger.verbose(message, { level, context: this.context });
        break;

      case 'info':
        this.logger.info(message, { level, context: this.context });
        break;

      case 'warn':
        this.logger.warn(message, { level, context: this.context });
        break;
    }
  }
}
