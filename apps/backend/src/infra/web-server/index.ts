import KoaRouter from '@koa/router';
import Koa from 'koa';
import * as path from 'path';
import { Config } from '@/infra/config';
import { Optional } from '@/infra/app/types';

export interface EndpointMetadata {
  path: string;
  method: string;
  middlewares: Koa.Middleware[];
}

export interface ControllerMetadata {
  prefix: string;
}
export const controllerMetadataSymbol = Symbol('controllerMetadata');
export const endpointMetadataSymbol = Symbol('endpointMetadata');

export const getDefaultEndpointMetadata = (): EndpointMetadata => {
  return {
    path: '',
    method: '',
    middlewares: [],
  };
};

type Controller = Record<string, any>;
type EndpointHandler = (ctx: Koa.Context) => any;

export class WebServer {
  private readonly client: Koa;
  private readonly config: Pick<Config, 'webServer'>;
  private readonly controllers: Controller[];

  constructor(config: Pick<Config, 'webServer'>, controllers: Controller[]) {
    this.client = new Koa();
    this.config = config;
    this.controllers = controllers;
  }

  start() {
    try {
      this.registerControllers();
      this.client.listen(this.config.webServer.port, () =>
        console.log(`Web server listening on port ${this.config.webServer.port}`),
      );
    } catch (err) {
      console.error(err);
    }
  }

  addMiddleware(middleware: Koa.Middleware<any, any, any>) {
    this.client.use(middleware);
  }

  private registerControllers() {
    for (const controller of this.controllers) {
      const controllerMetadata = Reflect.get(
        controller.constructor,
        controllerMetadataSymbol,
      ) as Optional<ControllerMetadata>;

      if (!controllerMetadata) {
        console.log(`${controller.name} is not marked as controller`);
        continue;
      }

      const { prefix } = controllerMetadata;
      const router = new KoaRouter();
      this.registerRoutes(controller, router, prefix);
      this.addRouter(router);
    }
  }

  private registerRoutes(controller: Controller, router: KoaRouter, prefix: string) {
    const prototype = Object.getPrototypeOf(controller);
    const properties = Object.getOwnPropertyNames(prototype);
    for (const property of properties) {
      const handler = controller[property];
      const endpointMetadata = Reflect.get(handler, endpointMetadataSymbol) as Optional<EndpointMetadata>;
      const isEndpoint = !!endpointMetadata && typeof handler === 'function';
      if (!isEndpoint) {
        continue;
      }

      const { path: routerPath, method, middlewares } = endpointMetadata;
      const routerClb = this.getRouterClb(controller, handler);
      router.register(path.join('/', prefix, routerPath), [method], [...middlewares, routerClb]);
    }
  }

  private getRouterClb(controller: Controller, handler: EndpointHandler) {
    return async (ctx: Koa.Context) => {
      const func = handler.bind(controller);
      const result = await func(ctx);
      if (result) {
        ctx.body = result;
      }
    }
  }

  private addRouter(router: KoaRouter) {
    this.addMiddleware(router.routes());
    this.addMiddleware(router.allowedMethods());
  }
}
