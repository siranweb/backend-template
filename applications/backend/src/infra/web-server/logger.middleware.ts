// import { performance } from 'perf_hooks';
// import { IWebServerLogger } from '@/infra/loggers/types';
//
// export const loggerMiddleware =
//   (logger: IWebServerLogger): Koa.Middleware =>
//   async (ctx, next) => {
//     const startTime = performance.now();
//     const { ip } = ctx.request;
//     logger.request(ctx.method, ctx.originalUrl, { ip });
//
//     await next();
//
//     const endTime = performance.now();
//     const ms = +(endTime - startTime).toFixed(1);
//     const { status } = ctx.response;
//
//     if (ctx.state.error) {
//       logger.failed(ctx.method, ctx.originalUrl, ms, status, ctx.state.error, { ip });
//     } else {
//       logger.finished(ctx.method, ctx.originalUrl, ms, status, { ip });
//     }
//   };
