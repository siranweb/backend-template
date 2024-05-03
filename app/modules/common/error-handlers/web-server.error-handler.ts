import { ZodError } from 'zod';
import { AppError } from '@/modules/common/errors/app-error';
import { ApiError, ApiErrorType, Context, IOnErrorHandler, IApiError } from '@/lib/web-server';

export class WebServerErrorHandler implements IOnErrorHandler {
  public async handle(error: any, context: Context): Promise<void> {
    const apiError = this.makeApiError(error);
    console.error(apiError);
    context.res.statusCode = apiError.statusCode;
    context.res.setHeader('Content-Type', 'application/json');
    context.res.end(
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
