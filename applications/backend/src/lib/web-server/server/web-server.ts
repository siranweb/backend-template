import http, { IncomingMessage, ServerResponse } from 'node:http';
import path from 'node:path';
import { EventEmitter } from 'node:events';
import { ControllerMetadata, EndpointMetadata, IController } from './types';
import { controllerMetadataSymbol, endpointMetadataSymbol } from './metadata';
import { Router } from '../routing';
import { ApiError, ErrorType } from './api-error';

interface Config {
  port: number;
  prefix?: string;
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

export type OnErrorHandler = (error: any, req: IncomingMessage, res: ServerResponse) => any | Promise<any>;
export type OnRequestHandler = (ctx: Context) => any | Promise<any>;
export type OnRequestFinishedHandler = (ctx: Context) => any | Promise<any>;

enum WebServerEvent {
  ERROR = 'error',
  REQUEST = 'request',
  REQUEST_FINISHED = 'request_finished',
}

export class WebServer {
  private readonly router: Router = new Router();
  private readonly eventEmitter: EventEmitter = new EventEmitter();
  private readonly config: Config;
  private readonly controllers: IController[];

  constructor(controllers: IController[], config: Config) {
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

  public onError(clb: OnErrorHandler): void {
    this.eventEmitter.on(WebServerEvent.ERROR, clb);
  }

  public onRequest(clb: OnRequestHandler): void {
    this.eventEmitter.on(WebServerEvent.REQUEST, clb);
  }

  public onRequestFinished(clb: OnRequestFinishedHandler): void {
    this.eventEmitter.on(WebServerEvent.REQUEST_FINISHED, clb);
  }

  private createHttpServer() {
    return http.createServer(async (req, res) => {
      try {
        await this.handleRequest(req, res);
      } catch (e: any) {
        this.handleRequestError(e, req, res);
      } finally {
        if (!res.writableEnded) {
          res.end();
        }
      }
    });
  }

  private async handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const context = this.getBaseContext(req, res);

    this.eventEmitter.emit(WebServerEvent.REQUEST, context);
    res.on('finish', () => {
      context.meta.responseTimestamp = Date.now();
      this.eventEmitter.emit(WebServerEvent.REQUEST_FINISHED, context);
    });

    const routeData = this.router.resolve(req.method!, req.url!);
    if (!routeData) {
      throw new ApiError({
        statusCode: 404,
        errorName: 'ROUTE_NOT_FOUND',
        type: ErrorType.APP,
      });
    }

    const { params, search, route } = routeData;
    const handler = routeData.handler as Handler;

    let body;
    try {
      body = await this.parseBody(req);
    } catch (e: any) {
      const isJsonError = e?.message?.includes('JSON.parse');
      if (isJsonError) {
        throw new ApiError({
          statusCode: 400,
          errorName: 'BAD_JSON_BODY',
          type: ErrorType.APP,
          original: e,
        });
      }

      throw new ApiError({
        statusCode: 500,
        type: ErrorType.UNKNOWN,
        original: e,
      });
    }

    context.params = params;
    context.search = search;
    context.body = body;
    context.meta.route = route;

    await handler(context);
  }

  private getBaseContext(req: IncomingMessage, res: ServerResponse): Context {
    return {
      req,
      res,
      params: {},
      search: {},
      body: undefined,
      meta: {
        url: req.url!,
        route: '',
        requestTimestamp: Date.now(),
        responseTimestamp: null,
      },
    };
  }

  private handleRequestError(error: any, req: IncomingMessage, res: ServerResponse): void {
    this.eventEmitter.emit(WebServerEvent.ERROR, error, req, res);
    const areListenersExists = this.eventEmitter.listeners(WebServerEvent.ERROR).length > 0;
    if (!areListenersExists) {
      res.statusCode = 400;
      res.end('Something went wrong');
    }
  }

  private async parseBody(req: IncomingMessage): Promise<string | Record<string, any>> {
    const promise = new Promise<string>((resolve, reject) => {
      let body = '';
      req.on('readable', () => (body += req.read()));
      req.on('end', () => resolve(body));
      req.on('error', (error) => reject(error));
    });
    const body = await promise;
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
