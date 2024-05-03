import { ChainFunc, HandlerFunc } from './shared';
import { OnErrorHandlerClb, OnRequestFinishedHandlerClb, OnRequestHandlerClb } from '../types/request-handler.interface';

export interface IWebServer {
  start(): Promise<void>;
  stop(): Promise<void>;
  handle(params: HandleParams): void;
  onError(handler: OnErrorHandlerClb | IOnErrorHandler): void;
  onRequest(clb: OnRequestHandlerClb): void;
  onRequestFinished(clb: OnRequestFinishedHandlerClb): void;
}

export type HandleParams = {
  method: string;
  path: string;
  handler: HandlerFunc;
  chain?: ChainFunc[];
};

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
