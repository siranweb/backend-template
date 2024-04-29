export interface IWsRouter {
  add(event: string, handler: any): void;
  resolve(event: string): StoredEventHandler | undefined;
}

export type StoredEventHandler = {
  event: string;
  handler: any;
};
