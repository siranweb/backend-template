import http, { IncomingMessage, ServerResponse } from 'node:http';
import path from 'node:path';
import { EventEmitter } from 'node:events';
import { ChainFunc, Context, Handler } from './types';
import { Router } from '../routing';
import { ApiError, ErrorType } from './api-error';
import { BodyParser } from '@/lib/web-server/server/body-parser';

export class WebServer {
  private readonly router: Router = new Router();
  private readonly bodyParser: BodyParser = new BodyParser();
  private readonly eventEmitter: EventEmitter = new EventEmitter();
  private readonly config: Config;
  private server?: http.Server;

  constructor(config: Config) {
    this.config = config;
  }

  public async start(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        this.server = this.createHttpServer();
        this.server.listen(this.config.port, () => resolve());
      } catch (e) {
        reject(e);
      }
    });
  }

  public async stop(): Promise<void> {
    if (!this.server) return;
    return new Promise<void>((resolve, reject) => {
      this.server!.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public handle(params: HandleParams): void {
    const { handler, path: handlePath, method, chain = [] } = params;
    const route = path.join('/', this.config.prefix ?? '', '/', handlePath);
    const routeHandler = this.buildHandlerFromChain(handler, chain);
    this.router.register(method, route, routeHandler);
  }

  public onError(handler: OnErrorHandlerClb | IOnErrorHandler): void {
    if ('handle' in handler) {
      this.eventEmitter.on(WebServerEvent.ERROR, handler.handle.bind(handler));
    } else {
      this.eventEmitter.on(WebServerEvent.ERROR, handler);
    }
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
        if (req.method === 'OPTIONS') {
          await this.handlePreFlight(req, res);
        } else {
          await this.handleRequest(req, res);
        }
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

  private async handlePreFlight(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const context = this.getBaseContext(req, res);

    this.eventEmitter.emit(WebServerEvent.REQUEST, context);
    res.on('finish', () => {
      context.meta.responseTimestamp = Date.now();
      this.eventEmitter.emit(WebServerEvent.REQUEST_FINISHED, context);
    });

    const methods = this.router.getMethods(req.url!);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', methods.join(', '));
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
        responseTimestamp: undefined,
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
    const body = await this.bodyParser.getStringBody(req);

    const isJson = !!req.headers['content-type']?.includes('application/json');
    if (isJson) {
      return this.bodyParser.parseJSON(body);
    }

    return body;
  }

  private buildHandlerFromChain(handler: Handler, chain: ChainFunc[]): Handler {
    let lastFunc = handler;
    for (const chainFunc of chain.reverse()) {
      const prev = lastFunc;
      lastFunc = (ctx: Context) => chainFunc(ctx, prev);
    }
    return lastFunc;
  }
}

interface Config {
  port: number;
  prefix?: string;
}

type HandleParams = {
  method: string;
  path: string;
  handler: Handler;
  chain?: ChainFunc[];
};

export interface IOnErrorHandler {
  handle: OnErrorHandlerClb;
}
export type OnErrorHandlerClb = (
  error: any,
  req: IncomingMessage,
  res: ServerResponse,
) => any | Promise<any>;

export type OnRequestHandler = (ctx: Context) => any | Promise<any>;
export type OnRequestFinishedHandler = (ctx: Context) => any | Promise<any>;

enum WebServerEvent {
  ERROR = 'error',
  REQUEST = 'request',
  REQUEST_FINISHED = 'request_finished',
}
