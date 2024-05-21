import { IErrorHandler } from '@/infrastructure/web-server/types/shared';
import { createError, H3Error, isError as isH3Error } from 'h3';
import { AppError } from '@/common/errors/app-error';

// TODO rename to error normalizer
// TODO debug mode (across all app)
export class ErrorHandler implements IErrorHandler {
  public handle(error: unknown): void {
    throw this.normalizeError(error);
  }

  private normalizeError(error: unknown): H3Error {
    if (isH3Error(error)) {
      if (error.statusMessage === 'Validation Error') {
        return createError({
          ...error,
          statusMessage: 'VALIDATION_ERROR',
        });
      }
      return error;
    }

    if (error instanceof AppError) {
      return createError({
        statusCode: 400,
        statusMessage: error.name,
        data: error.data,
      });
    }

    return createError({
      statusCode: 500,
    });
  }
}
