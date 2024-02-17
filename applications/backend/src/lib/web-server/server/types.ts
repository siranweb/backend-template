import { IncomingMessage, ServerResponse } from 'node:http';

export interface Context {
  req: IncomingMessage;
  res: ServerResponse;
  params: Record<string, string>;
  search: Record<string, any>;
  body: any;
  meta: {
    url: string;
    route: string;
    requestTimestamp: number;
    responseTimestamp?: number;
  };
}

export type Handler = (ctx: Context) => any;
export type ChainFunc = (ctx: Context, next: Handler) => void | Promise<void>;
