import http from 'node:http';
import path from 'path';
import { IController, ControllerMetadata, EndpointMetadata } from './types';
import { controllerMetadataSymbol, endpointMetadataSymbol } from './metadata';
import { Router, RouteHandler } from "../routing";

interface Config {
  port: number;
  prefix?: string;
}

export type Handler = RouteHandler<{}>;

export class WebServer {
  private readonly router: Router;
  private readonly config: Config;
  private readonly controllers: IController[];

  constructor(controllers: IController[], config: Config) {
    this.router = new Router();
    this.config = config;
    this.controllers = controllers;
  }

  public async start(): Promise<{ port: number; prefix?: string }> {
    return new Promise((resolve, reject) => {
      try {
        this.initControllers();

        const server = http.createServer((req, res) => {
          // TODO
          this.router.resolve(req.method ?? '', req.url ?? '');
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
      this.registerRoutes(controller, handlers);
    }
  }

  private getEndpointHandlers(controller: IController): Handler[] {
    const prototype = Object.getPrototypeOf(controller);
    const properties = Object.getOwnPropertyNames(prototype);

    const handlers: Handler[] = [];
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

  private registerRoutes(controller: IController, handlers: Handler[]): void {
    for (const handler of handlers) {
      const endpointMetadata = this.getEndpointMetadata(handler)!;
      // TODO rename path -> route
      const { path: routerPath, method } = endpointMetadata;
      const route = path.join('/', this.config.prefix ?? '', '/', routerPath);

      // TODO pass args to handler
      this.router.register(method, route, handler.bind(controller));
    }
  }

  private getControllerMetadata(controller: IController): ControllerMetadata | null {
    return Reflect.get(controller.constructor, controllerMetadataSymbol);
  }

  private getEndpointMetadata(handler: any): EndpointMetadata | null {
    return Reflect.get(handler, endpointMetadataSymbol);
  }

  private checkIsEndpoint(endpointMetadata: EndpointMetadata | null, handler: any): boolean {
    return !!endpointMetadata && typeof handler === 'function';
  }
}
