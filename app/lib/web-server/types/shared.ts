import { IncomingMessage, ServerResponse } from 'node:http';

export type Context = {
  req: IncomingMessage;
  res: ServerResponse;
  params: Record<string, string>;
  search: Record<string, any>;
  body: unknown;
  meta: {
    url: string;
    route: string;
    requestTimestamp: number;
    responseTimestamp?: number;
  };
};

export type HandlerFunc = (ctx: Context) => any;
export type ChainFunc = (ctx: Context, next: HandlerFunc) => any;
export interface IChainHandler {
  handle: ChainFunc;
}
