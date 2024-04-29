import { Context, Handler } from '@/lib/web-sockets';
import { ChainFunc } from '@/lib/web-sockets/types/shared';
import { WebSocket } from 'ws';

export interface IWsServer {
  start(): Promise<void>;
  stop(): Promise<void>;
  handle(event: string, handler: Handler, params: HandleParams): void;
  onError(clb: OnErrorHandler): void;
  onEvent(clb: OnEventHandler): void;
  onEventFinished(clb: OnEventFinishedHandler): void;
}

export type HandleParams = {
  chain?: ChainFunc[];
};

export type OnErrorHandler = (error: any, ws: WebSocket) => any | Promise<any>;
export type OnEventHandler = (ctx: Context) => any | Promise<any>;
export type OnEventFinishedHandler = (ctx: Context) => any | Promise<any>;

export type Config = {
  port: number;
};

export enum WsServerEvent {
  ERROR = 'error',
  EVENT = 'event',
  EVENT_FINISHED = 'event_finished',
}
