import { IncomingMessage, ServerResponse } from 'node:http';

export interface EndpointMetadata {
  path: string;
  method: string;
  chain: ChainFunc[];
}

export interface ControllerMetadata {
  prefix: string;
}

export interface IController {
  [key: string]: any;
}

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
