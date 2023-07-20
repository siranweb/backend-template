import KoaRouter from '@koa/router';
import Koa from 'koa';
import * as path from 'path';
import { Config } from '@/infra/config';

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


export class WebServer {
  private readonly app: Koa;
  private readonly config: Pick<Config, 'webServer'>;
  private readonly controllers: Controller[];

  constructor(config: Pick<Config, 'webServer'>, controllers: Controller[]) {
    this.config = config;
    this.app = new Koa();
    this.controllers = controllers;
  }

  async start() {
    try {
      this.registerControllers(this.controllers);
      this.app.listen(this.config.webServer.port, () => console.log(`Listening on port ${this.config.webServer.port}`));
    } catch (err) {
      console.error(err);
    }
  }

  addMiddleware(middleware: Koa.Middleware) {
    this.app.use(middleware);
  }

  private registerControllers(controllers: Controller[]) {
    for (const controller of controllers) {
      const controllerMetadata = Reflect.get(controller.constructor, controllerMetadataSymbol) as ControllerMetadata;
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
      const endpointMetadata = Reflect.get(handler, endpointMetadataSymbol) as EndpointMetadata;
      const isEndpoint = !!endpointMetadata;
      if (!isEndpoint) {
        continue;
      }

      const { path: routerPath, method, middlewares } = endpointMetadata;

      router.register(path.join('/', prefix, routerPath), [method], [...middlewares, handler]);
    }
  }

  private addRouter(router: KoaRouter) {
    this.app.use(router.routes());
    this.app.use(router.allowedMethods())
  }
}
