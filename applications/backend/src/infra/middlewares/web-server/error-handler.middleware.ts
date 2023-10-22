// import { AppError } from '@/infra/errors/app-error';
// import { ApiError } from '@/infra/errors/api-error';
// import { ZodError } from 'zod';
//
// export const errorHandlerMiddleware = (): Koa.Middleware => async (ctx, next) => {
//   try {
//     await next();
//     if (ctx.response.status >= 400 && ctx.response.status <= 599) {
//       throw ApiError.createFromHttpError({
//         statusCode: ctx.status,
//       });
//     }
//   } catch (e: any) {
//     const apiError = makeApiError(e);
//     ctx.state.error = apiError;
//     ctx.status = apiError.statusCode;
//     ctx.body = {
//       error: {
//         type: apiError.type,
//         name: apiError.errorName,
//         data: apiError.data,
//       },
//     };
//   }
// };
//
// const makeApiError = (error: any): ApiError => {
//   const isApiError = error instanceof ApiError;
//   if (isApiError) {
//     return error;
//   }
//
//   const isAppError = error instanceof AppError;
//   if (isAppError) {
//     return ApiError.createFromAppError({
//       errorName: error.errorName,
//       data: error.data,
//     });
//   }
//
//   const isValidationError = error instanceof ZodError;
//   if (isValidationError) {
//     return ApiError.createFromValidationError({
//       issues: error.issues,
//     });
//   }
//
//   return ApiError.createFromUnknownError({
//     original: error,
//   });
// };
