export interface IWebServerLogger {
  request(method: string, url: string, context?: Record<any, any>): void;
  finished(method: string, url: string, ms: number, status: number, context?: Record<any, any>): void;
  failed(method: string, url: string, ms: number, status: number, error: any, context?: Record<any, any>): void;
}

export interface IAppLogger {
  error(message: string, context?: Record<any, any>): void;
  warn(message: string, context?: Record<any, any>): void;
  info(message: string, context?: Record<any, any>): void;
}