import KoaRouter from '@koa/router';
import Koa from 'koa';
import * as path from 'path';
import { Controller, ControllerMetadata, EndpointHandler, EndpointMetadata } from './types';
import { controllerMetadataSymbol, endpointMetadataSymbol } from './metadata';
import { Config } from '@/infra/config';

export class WebServer {
  private readonly client: Koa;
  private readonly config: Pick<Config, 'webServer'>;
  private readonly controllers: Controller[];
  private readonly prefix: string;

  constructor(config: Config, controllers: Controller[], prefix?: string) {
    this.client = new Koa();
    this.config = config;
    this.controllers = controllers;
    this.prefix = prefix ?? '';
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

  addMiddleware(middleware: Koa.Middleware<any, any>) {
    this.client.use(middleware);
  }

  private registerControllers() {
    for (const controller of this.controllers) {
      const controllerMetadata = this.getControllerMetadata(controller);

      if (!controllerMetadata) {
        console.log(`${controller.name} is not marked as controller`);
        continue;
      }

      const { prefix: controllerPrefix } = controllerMetadata;
      const router = new KoaRouter();
      this.registerRoutes(controller, router, controllerPrefix);
      this.addRouter(router);
    }
  }

  private getControllerMetadata(controller: Controller): ControllerMetadata | null {
    return Reflect.get(
      controller.constructor,
      controllerMetadataSymbol,
    );
  }

  private registerRoutes(controller: Controller, router: KoaRouter, controllerPrefix: string) {
    const prototype = Object.getPrototypeOf(controller);
    const properties = Object.getOwnPropertyNames(prototype);
    for (const property of properties) {
      const handler = controller[property];
      const endpointMetadata = this.getEndpointMetadata(handler);
      const isEndpoint = this.checkIsEndpoint(endpointMetadata, handler);
      if (!isEndpoint) {
        continue;
      }

      const { path: routerPath, method, middlewares } = endpointMetadata as EndpointMetadata;
      const routerClb = this.getRouterClb(controller, handler);
      const pathStr = path.join('/', this.prefix, '/', controllerPrefix, routerPath);
      router.register(pathStr, [method], [...middlewares, routerClb]);
    }
  }

  private getEndpointMetadata(handler: any): EndpointMetadata | null {
    return Reflect.get(
      handler,
      endpointMetadataSymbol,
    ) as EndpointMetadata | null;
  }

  private checkIsEndpoint(endpointMetadata: EndpointMetadata | null, handler: any): boolean {
    return !!endpointMetadata && typeof handler === 'function';
  }

  private getRouterClb(controller: Controller, handler: EndpointHandler) {
    return async (ctx: Koa.Context) => {
      const func = handler.bind(controller);
      const result = await func(ctx);
      if (result) {
        ctx.body = result;
      }
    };
  }

  private addRouter(router: KoaRouter) {
    this.addMiddleware(router.routes());
    this.addMiddleware(router.allowedMethods());
  }
}
