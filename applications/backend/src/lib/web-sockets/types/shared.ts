import { WebSocket } from 'ws';
import { IncomingMessage } from 'node:http';

export interface Context {
  ws: WebSocket;
  req: IncomingMessage;
  data: Record<any, any>;
  meta: {
    timestamp: number;
  };
}

export type Handler = (ctx: Context) => any | Promise<any>;
export type ChainFunc = (ctx: Context, next: Handler) => void | Promise<void>;
