import Koa from 'koa';
import { performance } from 'perf_hooks';

type LoggerContext = Record<any, any>;

export interface IWebServerLogger {
  request(method: string, url: string, context?: LoggerContext): void;
  finished(method: string, url: string, ms: number, context?: LoggerContext): void;
  failed(method: string, url: string, ms: number, error: any, context?: LoggerContext): void;
}

export const loggerMiddleware =
  (logger: IWebServerLogger): Koa.Middleware =>
  async (ctx, next) => {
    const startTime = performance.now();
    const { ip } = ctx.request;
    logger.request(ctx.method, ctx.originalUrl, { ip });

    await next();

    const endTime = performance.now();
    const ms = +(endTime - startTime).toFixed(1);
    const { status } = ctx.response;

    if (ctx.state.error) {
      logger.failed(ctx.method, ctx.originalUrl, ms, ctx.state.error, { ip, status });
    } else {
      logger.finished(ctx.method, ctx.originalUrl, ms, { ip, status });
    }
  };
