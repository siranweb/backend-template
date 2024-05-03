import { EventEmitter } from 'node:events';
import { IncomingMessage, ServerResponse } from 'node:http';
import {
  IRequestHandler,
  OnErrorHandlerClb,
  OnRequestFinishedHandlerClb,
  OnRequestHandlerClb,
} from '../types/request-handler.interface';
import { WebServerEvent } from '../types/web-server.interface';
import { ApiError } from '../common/api-error';
import { BodyParser } from '../common/body-parser';
import { ApiErrorType } from '../types/api-error.interface';
import { IRouter } from '../types/router.interface';
import { Context, HandlerFunc } from '../types/shared';

export class RequestHandler implements IRequestHandler {
  private readonly bodyParser: BodyParser = new BodyParser();
  private readonly eventEmitter: EventEmitter = new EventEmitter();

  constructor(private readonly router: IRouter) {}

  public async listener(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const context = this.initContext(req, res);

    this.eventEmitter.emit(WebServerEvent.REQUEST, context);
    res.on('finish', () => {
      context.meta.responseTimestamp = Date.now();
      this.eventEmitter.emit(WebServerEvent.REQUEST_FINISHED, context);
    });

    try {
      if (req.method === 'OPTIONS') {
        await this.handlePreFlightRequest(context);
      } else {
        await this.handleRequest(context);
      }
    } catch (error: any) {
      this.handleRequestError(error, context);
    } finally {
      if (!res.writableEnded) {
        res.end();
      }
    }
  }

  public onError(clb: OnErrorHandlerClb): void {
    this.eventEmitter.on(WebServerEvent.ERROR, clb);
  }

  public onRequest(clb: OnRequestHandlerClb): void {
    this.eventEmitter.on(WebServerEvent.REQUEST, clb);
  }

  public onRequestFinished(clb: OnRequestFinishedHandlerClb): void {
    this.eventEmitter.on(WebServerEvent.REQUEST_FINISHED, clb);
  }

  private async handleRequest(context: Context): Promise<void> {
    const routeData = this.router.resolve(context.req.method!, context.req.url!);
    if (!routeData) {
      throw new ApiError({
        statusCode: 404,
        errorName: 'ROUTE_NOT_FOUND',
        type: ApiErrorType.APP,
      });
    }

    const { params, search, route } = routeData;
    const handler = routeData.handler as HandlerFunc;

    let body;
    try {
      body = await this.parseBody(context.req);
    } catch (e: any) {
      const isJsonError = e?.message?.includes('JSON.parse');
      if (isJsonError) {
        throw new ApiError({
          statusCode: 400,
          errorName: 'BAD_JSON_BODY',
          type: ApiErrorType.APP,
          original: e,
        });
      }

      throw new ApiError({
        statusCode: 500,
        type: ApiErrorType.UNKNOWN,
        original: e,
      });
    }

    context.params = params;
    context.search = search;
    context.body = body;
    context.meta.route = route;

    await handler(context);
  }

  private async handlePreFlightRequest(context: Context): Promise<void> {
    const methods = this.router.getMethods(context.req.url!);
    context.res.setHeader('Access-Control-Allow-Origin', '*');
    context.res.setHeader('Access-Control-Allow-Methods', methods.join(', '));
  }

  private initContext(req: IncomingMessage, res: ServerResponse): Context {
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

  private handleRequestError(error: any, context: Context): void {
    this.eventEmitter.emit(WebServerEvent.ERROR, error, context);
    const areListenersExists = this.eventEmitter.listeners(WebServerEvent.ERROR).length > 0;
    if (!areListenersExists) {
      context.res.statusCode = 400;
      context.res.end('Something went wrong');
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
}
