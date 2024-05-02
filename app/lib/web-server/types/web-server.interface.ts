import { ChainFunc, Context, HandlerFunc } from './shared';
import { IncomingMessage, ServerResponse } from 'node:http';

export interface IWebServer {
  start(): Promise<void>;
  stop(): Promise<void>;
  handle(params: HandleParams): void;
  onError(handler: OnErrorHandlerClb | IOnErrorHandler): void;
  onRequest(clb: OnRequestHandler): void;
  onRequestFinished(clb: OnRequestFinishedHandler): void;
}

export type HandleParams = {
  method: string;
  path: string;
  handler: HandlerFunc;
  chain?: ChainFunc[];
};

export type OnErrorHandlerClb = (
  error: any,
  req: IncomingMessage,
  res: ServerResponse,
) => any | Promise<any>;
export type OnRequestHandler = (ctx: Context) => any | Promise<any>;
export type OnRequestFinishedHandler = (ctx: Context) => any | Promise<any>;

export interface IOnErrorHandler {
  handle: OnErrorHandlerClb;
}

export type WebServerConfig = {
  port: number;
  prefix?: string;
};

export enum WebServerEvent {
  ERROR = 'error',
  REQUEST = 'request',
  REQUEST_FINISHED = 'request_finished',
}
