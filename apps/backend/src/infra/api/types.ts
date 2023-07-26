type Context = Record<any, any>;

export interface ApiLogger {
  request(method: string, url: string, context?: Context): void;
  finished(method: string, url: string, ms: number, context?: Context): void;
  failed(method: string, url: string, ms: number, error: string, context?: Context): void;
}