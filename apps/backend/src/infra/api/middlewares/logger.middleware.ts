import Koa from 'koa';
import { performance } from 'perf_hooks';
import { ApiLogger } from '@/infra/api/types';

export const loggerMiddleware = (logger: ApiLogger): Koa.Middleware => async (ctx, next) => {
  const startTime = performance.now();
  logger.request(ctx.method, ctx.originalUrl);

  try {
    await next();

    // Handle all errors that are weren't thrown (like 404)
   if (ctx.response.status >= 400) {
     throw new Error(`Status: ${ctx.response.status}. Message: ${ctx.response.message}`);
   }

    const endTime = performance.now();
    const ms = +(endTime - startTime).toFixed(1);
    logger.finished(ctx.method, ctx.originalUrl, ms);
  } catch (e: any) {
    const endTime = performance.now();
    const ms = +(endTime - startTime).toFixed(1);
    logger.failed(ctx.method, ctx.originalUrl, ms, e.message);
    // throw e;
  }
};
