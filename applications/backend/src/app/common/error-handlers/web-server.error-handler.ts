import { AppError } from '@/app/common/errors/app-error';
import { ApiError, ApiErrorType } from '@/lib/web-server';
import { ZodError } from 'zod';
import { IncomingMessage, ServerResponse } from 'node:http';
import { IOnErrorHandler } from '@/lib/web-server/types/web-server.interface';
import { IApiError } from '@/lib/web-server/types/api-error.interface';

export class WebServerErrorHandler implements IOnErrorHandler {
  public async handle(error: any, req: IncomingMessage, res: ServerResponse): Promise<void> {
    const apiError = this.makeApiError(error);
    console.error(apiError);
    res.statusCode = apiError.statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: {
          type: apiError.type,
          name: apiError.errorName,
          data: apiError.data,
        },
      }),
    );
  }

  private makeApiError(error: any): IApiError {
    const isApiError = error instanceof ApiError;
    if (isApiError) {
      return error;
    }

    const isAppError = error instanceof AppError;
    if (isAppError) {
      return new ApiError({
        type: ApiErrorType.APP,
        statusCode: 400,
        errorName: error.errorName,
        data: error.data,
        original: error,
      });
    }

    const isValidationError = error instanceof ZodError;
    if (isValidationError) {
      return new ApiError({
        type: ApiErrorType.VALIDATION,
        statusCode: 400,
        errorName: 'VALIDATION_NOT_PASSED',
        data: {
          issues: error.issues,
        },
        original: error,
      });
    }

    return new ApiError({
      type: ApiErrorType.UNKNOWN,
      statusCode: 500,
      errorName: 'UNKNOWN',
      original: error,
    });
  }
}
