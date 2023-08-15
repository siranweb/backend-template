type Context = Record<any, any>;

export interface ISocketsLogger {
  inbound(eventName: string): void;
  inboundFailed(eventName: string): void;
  outbound(eventName: string): void;
  outboundFailed(eventName: string): void;
}