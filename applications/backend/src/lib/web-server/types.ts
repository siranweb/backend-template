import Koa from 'koa';

export interface EndpointMetadata {
  path: string;
  method: string;
  middlewares: Koa.Middleware[];
}

export interface ControllerMetadata {
  prefix: string;
}

export type Controller = Record<string, any>;
export type EndpointHandler = (ctx: Koa.Context) => any;
