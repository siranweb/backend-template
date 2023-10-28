import http, { IncomingMessage, ServerResponse } from 'node:http';
import path from 'node:path';
import { ControllerMetadata, EndpointMetadata, IController } from './types';
import { controllerMetadataSymbol, endpointMetadataSymbol } from './metadata';
import { Router } from '../routing';
import { ApiError, ErrorType } from './api-error';

interface Config {
  port: number;
  prefix?: string;
}

interface Context {
  req: IncomingMessage;
  res: ServerResponse;
  params: Record<string, string>;
  search: Record<string, any>;
  body: any;
  meta: {
    url: string;
    route: string;
    requestTimestamp: number;
  }
}
export type Handler = (ctx: Context) => any;

type ErrorHandler = (error: any, req: IncomingMessage, res: ServerResponse) => any | Promise<any>;

export class WebServer {
  private readonly router: Router;
  private readonly config: Config;
  private readonly controllers: IController[];
  private errorHandler: ErrorHandler | null = null;

  constructor(controllers: IController[], config: Config) {
    this.router = new Router();
    this.config = config;
    this.controllers = controllers;
  }

  public async start(): Promise<{ port: number; prefix?: string }> {
    return new Promise((resolve, reject) => {
      try {
        this.initControllers();
        const server = this.createHttpServer();
        server.listen(this.config.port, () => {
          resolve({ port: this.config.port, prefix: this.config.prefix });
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  public setErrorHandler(clb: ErrorHandler) {
    this.errorHandler = clb;
  }

  private createHttpServer() {
    return http.createServer(async (req, res) => {
      const requestTimestamp = Date.now();
      try {
        await this.handleRequest(req, res, requestTimestamp);
      } catch (e: any) {
        if (this.errorHandler) {
          this.errorHandler(e, req, res);
        } else {
          res.statusCode = 400;
          res.end('Something went wrong');
        }
      } finally {
        if (!res.writableEnded) {
          res.end();
        }
      }
    });
  }

  private async handleRequest(req: IncomingMessage, res: ServerResponse, requestTimestamp: number): Promise<void> {
    const routeData = this.router.resolve(req.method!, req.url!);
    if (!routeData) {
      throw new ApiError({
        statusCode: 404,
        type: ErrorType.HTTP
      });
    }

    const { params, search, url, route } = routeData;
    const handler = routeData.handler as Handler;

    let body;
    try {
      body = await this.parseBody(req);
    } catch (e) {
      throw new ApiError({
        statusCode: 500,
        type: ErrorType.UNKNOWN,
        original: e,
      })
    }
    
    const context: Context = {
      req,
      res,
      params,
      search,
      body,
      meta: {
        url,
        route,
        requestTimestamp,
      }
    };

    await handler(context);
  }

  private async parseBody(req: IncomingMessage): Promise<string | Record<string, any>> {
    const promise = new Promise((resolve, reject) => {
      let body = '';
      req.on('readable', () => body += req.read());
      req.on('end', () => resolve(body));
      req.on('error', (error) => reject(error));
    });
    const body = (await promise) as string;
    const isJson = !!req.headers['content-type']?.includes('application/json');
    return isJson ? JSON.parse(body) : body;
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
