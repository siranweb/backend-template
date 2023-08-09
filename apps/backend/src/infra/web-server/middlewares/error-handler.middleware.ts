import Koa from 'koa';
import { ApplicationError } from '@/infra/app/application-error';

export const errorHandlerMiddleware = (): Koa.Middleware => async (ctx, next) => {
  try {
    await next();
  } catch (e: any) {
    if (e instanceof ApplicationError) {
      ctx.status = 400;
      ctx.body = {
        error: {
          name: e.errorName,
          data: e.data,
        }
      }
    }
  }
};
