import { ChainFunc, HandlerFunc, IChainHandler } from './shared';
import {
  OnErrorHandlerClb,
  OnRequestFinishedHandlerClb,
  OnRequestHandlerClb,
} from '../types/request-handler.interface';

export interface IWebServer {
  start(): Promise<void>;
  stop(): Promise<void>;
  handle(params: HandleParams): void;
  onError(handler: OnErrorHandlerClb | IOnErrorHandler): void;
  onRequest(handler: OnRequestHandlerClb | IOnRequestHandler): void;
  onRequestFinished(handler: OnRequestFinishedHandlerClb | IOnRequestFinishedHandler): void;
}

export type HandleParams = {
  method: string;
  path: string;
  handler: HandlerFunc;
  chain?: (ChainFunc | IChainHandler)[];
};

export interface IOnErrorHandler {
  handle: OnErrorHandlerClb;
}

export interface IOnRequestHandler {
  handle: OnRequestHandlerClb;
}

export interface IOnRequestFinishedHandler {
  handle: OnRequestFinishedHandlerClb;
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
