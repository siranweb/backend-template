import { AppError } from '@/infra/errors/app-error';
import { ApiError, ErrorType } from '@/lib/web-server';
import { ZodError } from 'zod';
import { IncomingMessage, ServerResponse } from 'node:http';

export class ErrorHandler {
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

  private makeApiError(error: any): ApiError {
    const isApiError = error instanceof ApiError;
    if (isApiError) {
      return error;
    }

    const isAppError = error instanceof AppError;
    if (isAppError) {
      return new ApiError({
        type: ErrorType.APP,
        statusCode: 400,
        errorName: error.errorName,
        data: error.data,
        original: error,
      });
    }

    const isValidationError = error instanceof ZodError;
    if (isValidationError) {
      return new ApiError({
        type: ErrorType.VALIDATION,
        statusCode: 400,
        errorName: 'VALIDATION_NOT_PASSED',
        data: {
          issues: error.issues,
        },
        original: error,
      });
    }

    return new ApiError({
      type: ErrorType.UNKNOWN,
      statusCode: 500,
      errorName: 'UNKNOWN',
      original: error,
    });
  }
}
