import { WinstonDefaultLogLevel } from '../enums/winston-default-log-level';

export interface ParamsLoggerInterface {
  level: WinstonDefaultLogLevel;
  isRotateLoggerFile: boolean;
  loggerDirectory: string;
  loggerMaxSize: string;
  loggerMaxFile: string;
}
