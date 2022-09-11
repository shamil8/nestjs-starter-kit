import { WinstonDefaultLogLevel } from '../enums/winston-default-log-level';

export interface LoggerParamsInterface {
  level: WinstonDefaultLogLevel;
  isRotateLoggerFile: boolean;
  loggerName: string;
  loggerMaxSize: string;
  loggerMaxFile: string;
}
