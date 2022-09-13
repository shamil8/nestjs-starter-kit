import { WinstonDefaultLogLevel } from '../enums/winston-default-log-level';

export interface ParamsLoggerInterface {
  level: WinstonDefaultLogLevel;
  isRotateLoggerFile: boolean;
  loggerName: string;
  loggerMaxSize: string;
  loggerMaxFile: string;
}
