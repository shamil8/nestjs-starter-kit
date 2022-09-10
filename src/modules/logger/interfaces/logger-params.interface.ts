import { WinstonDefaultLogLevel } from '../enums/winston-default-log-level';

export interface LoggerParamsInterface {
  level: WinstonDefaultLogLevel;
  isRotateLoggerFilesActivated: boolean;
  loggerName: string;
  loggerMaxSize: string;
  loggerMaxFile: string;
}
