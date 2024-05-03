import { IncomingMessage, ServerResponse } from 'node:http';
import { Context } from '../types/shared';

export interface IRequestHandler {
  listener(req: IncomingMessage, res: ServerResponse): Promise<void>;
  onError(clb: OnErrorHandlerClb): void;
  onRequest(clb: OnRequestHandlerClb): void;
  onRequestFinished(clb: OnRequestFinishedHandlerClb): void;
}

export type OnErrorHandlerClb = (
  error: any,
  context: Context,
) => any | Promise<any>;
export type OnRequestHandlerClb = (ctx: Context) => any | Promise<any>;
export type OnRequestFinishedHandlerClb = (ctx: Context) => any | Promise<any>;
