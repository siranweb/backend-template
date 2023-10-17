import http from 'node:http';
import path from 'path';
import Router from 'find-my-way';
import { IController, ControllerMetadata, EndpointMetadata, EndpointHandler } from './types';
import { controllerMetadataSymbol, endpointMetadataSymbol } from './metadata';

interface Config {
  port: number;
  prefix?: string;
}

export class WebServer {
  private readonly router: Router.Instance<Router.HTTPVersion.V1>;
  private readonly config: Config;
  private readonly controllers: IController[];

  constructor(controllers: IController[], config: Config) {
    this.router = Router({

    });
    this.config = config;
    this.controllers = controllers;
  }

  public async start(): Promise<{ port: number; prefix?: string }> {
    return new Promise((resolve, reject) => {
      try {
        this.initControllers();

        const server = http.createServer((req, res) => {
          this.router.lookup(req, res);
        });

        server.listen(this.config.port, () => {
          resolve({ port: this.config.port, prefix: this.config.prefix });
        });

      } catch (e) {
        reject(e);
      }
    });
  }

  private initControllers(): void {
    for (const controller of this.controllers) {
      const controllerMetadata = this.getControllerMetadata(controller);

      if (!controllerMetadata) {
        console.log(`${controller.name} is not marked as controller`);
        continue;
      }

      const handlers = this.getEndpointHandlers(controller);
      this.registerRoutes(handlers);
    }
  }

  private getEndpointHandlers(controller: IController): EndpointHandler[] {
    const prototype = Object.getPrototypeOf(controller);
    const properties = Object.getOwnPropertyNames(prototype);

    const handlers: EndpointHandler[] = [];
    for (const property of properties) {
      const handler = controller[property];
      const endpointMetadata = this.getEndpointMetadata(handler);
      const isEndpoint = this.checkIsEndpoint(endpointMetadata, handler);
      if (isEndpoint) {
        handlers.push(handler);
      }
    }

    return handlers;
  }

  private registerRoutes(handlers: EndpointHandler[]): void {
    for (const handler of handlers) {
      const endpointMetadata = this.getEndpointMetadata(handler)!;
      const { path: routerPath, method } = endpointMetadata;
      const pathStr = path.join('/', this.config.prefix ?? '', '/', routerPath);

      this.router.on(method, pathStr, this.decorateHandler(handler));
    }
  }

  private decorateHandler(handler: EndpointHandler): EndpointHandler {
    return async (req, res, ...args) => {
      try {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        return await handler(req, res, ...args);
      } catch (e) {
        console.log(555);
      }
    }
  }

  private getControllerMetadata(controller: IController): ControllerMetadata | null {
    return Reflect.get(controller.constructor, controllerMetadataSymbol);
  }

  private getEndpointMetadata(handler: any): EndpointMetadata | null {
    return Reflect.get(
      handler,
      endpointMetadataSymbol,
    );
  }

  private checkIsEndpoint(endpointMetadata: EndpointMetadata | null, handler: any): boolean {
    return !!endpointMetadata && typeof handler === 'function';
  }
}
