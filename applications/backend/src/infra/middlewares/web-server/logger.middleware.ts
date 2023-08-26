import Koa from 'koa';
import { performance } from 'perf_hooks';

type LoggerContext = Record<any, any>;

export interface IWebServerLogger {
  request(method: string, url: string, context?: LoggerContext): void;
  finished(method: string, url: string, ms: number, context?: LoggerContext): void;
  failed(method: string, url: string, ms: number, error: string, context?: LoggerContext): void;
}

export const loggerMiddleware =
  (logger: IWebServerLogger): Koa.Middleware =>
  async (ctx, next) => {
    const startTime = performance.now();
    const { ip } = ctx.request;
    logger.request(ctx.method, ctx.originalUrl, { ip });

    try {
      await next();
      const endTime = performance.now();

      // Handle all errors that are weren't thrown (like 404)
      // if (ctx.response.status >= 400) {
      //   throw new Error(ctx.response.message);
      // }

      const ms = +(endTime - startTime).toFixed(1);
      const { status } = ctx.response;
      logger.finished(ctx.method, ctx.originalUrl, ms, { ip, status });
    } catch (e: any) {
      const endTime = performance.now();
      const ms = +(endTime - startTime).toFixed(1);
      const { status } = ctx.response;
      logger.failed(ctx.method, ctx.originalUrl, ms, e.message, { ip, status });
      throw e;
    }
  };
