import { WebSocket } from 'ws';

export type Gateway = Record<string, any>;

export interface Context {
  ws: WebSocket;
  data: Record<any, any>;
  meta: {
    timestamp: number;
  };
}

export type WsHandler = (ctx: Context) => any | Promise<any>;

export interface WsGatewayMetadata {}

export interface WsHandlerMetadata {
  command: string;
}
