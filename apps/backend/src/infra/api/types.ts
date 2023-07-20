export interface ApiLogger {
  request(method: string, url: string): void;
  finished(method: string, url: string, ms: number): void;
  failed(method: string, url: string, ms: number, error: string): void;
}