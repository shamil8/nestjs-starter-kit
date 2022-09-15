export interface ErrorLoggerInterface {
  context?: string;
  stack?: string;
  extra?: any;
  code?: number;
  [key: string]: any;
}
