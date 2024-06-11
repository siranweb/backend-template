export interface IWebServer {
  start(): Promise<void>;
  stop(): Promise<void>;
}
