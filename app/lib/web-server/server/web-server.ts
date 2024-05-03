import http from 'node:http';
import path from 'node:path/posix';
import { ChainFunc, Context, HandlerFunc, IChainHandler } from '../types/shared';
import { Router } from './routing/router';
import { IRouter } from '../types/router.interface';
import {
  HandleParams,
  IOnErrorHandler,
  IOnRequestFinishedHandler,
  IOnRequestHandler,
  IWebServer,
  WebServerConfig,
} from '../types/web-server.interface';
import {
  IRequestHandler,
  OnErrorHandlerClb,
  OnRequestFinishedHandlerClb,
  OnRequestHandlerClb,
} from '@/lib/web-server/types/request-handler.interface';
import { RequestHandler } from '@/lib/web-server/server/request-handler';

export class WebServer implements IWebServer {
  private readonly router: IRouter;
  private readonly requestHandler: IRequestHandler;
  private readonly config: WebServerConfig;
  private server?: http.Server;

  constructor(config: WebServerConfig) {
    this.router = new Router();
    this.requestHandler = new RequestHandler(this.router);
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
    return new Promise<void>((resolve, reject) => {
      if (!this.server) {
        resolve();
        return;
      }

      this.server.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public handle(params: HandleParams): void {
    const { handler, path, method, chain = [] } = params;
    const route = this.buildRoute(path);
    const handlerWithChain = this.buildHandlerFromChain(handler, chain);
    this.router.register(method, route, handlerWithChain);
  }

  public onError(handler: OnErrorHandlerClb | IOnErrorHandler): void {
    if ('handle' in handler) {
      this.requestHandler.onError(handler.handle.bind(handler));
    } else {
      this.requestHandler.onError(handler);
    }
  }

  public onRequest(handler: OnRequestHandlerClb | IOnRequestHandler): void {
    if ('handle' in handler) {
      this.requestHandler.onRequest(handler.handle.bind(handler));
    } else {
      this.requestHandler.onRequest(handler);
    }
  }

  public onRequestFinished(handler: OnRequestFinishedHandlerClb | IOnRequestFinishedHandler): void {
    if ('handle' in handler) {
      this.requestHandler.onRequestFinished(handler.handle.bind(handler));
    } else {
      this.requestHandler.onRequestFinished(handler);
    }
  }

  private createHttpServer() {
    return http.createServer(this.requestHandler.listener.bind(this.requestHandler));
  }

  private buildRoute(handlerPath: string): string {
    return path.join('/', this.config.prefix ?? '', '/', handlerPath);
  }

  private buildHandlerFromChain(
    handler: HandlerFunc,
    chain: (ChainFunc | IChainHandler)[],
  ): HandlerFunc {
    let lastFunc = handler;
    for (const chainHandler of chain.reverse()) {
      const chainFunc = this.getChainFunc(chainHandler);
      const prev = lastFunc;
      lastFunc = (ctx: Context) => chainFunc(ctx, prev);
    }
    return lastFunc;
  }

  private getChainFunc(chainHandler: ChainFunc | IChainHandler): ChainFunc {
    if ('handle' in chainHandler) {
      return chainHandler.handle.bind(chainHandler);
    }
    return chainHandler;
  }
}
