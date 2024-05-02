export { WebServer } from './server/web-server';
export { ApiError } from './common/api-error';
export { ApiErrorType } from './types/api-error.interface';
export type { Context, HandlerFunc } from './types/shared';
export type {
  OnRequestHandler,
  OnRequestFinishedHandler,
  OnErrorHandlerClb,
  HandleParams,
} from './types/web-server.interface';
