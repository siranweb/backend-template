import { WebSocket } from 'ws';
import { IncomingMessage } from 'node:http';

export type Gateway = Record<string, any>;

export interface Context {
  ws: WebSocket;
  req: IncomingMessage;
  data: Record<any, any>;
  meta: {
    timestamp: number;
  };
}

export type Handler = (ctx: Context) => any | Promise<any>;

export interface WsGatewayMetadata {}

export interface WsHandlerMetadata {
  event: string;
}
