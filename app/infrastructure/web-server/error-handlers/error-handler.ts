import { IErrorHandler } from '@/infrastructure/web-server/types/shared';
import { createError, H3Error, H3Event, isError as isH3Error, sendError } from 'h3';
import { AppError } from '@/common/errors/app-error';

export class ErrorHandler implements IErrorHandler {
  public handle(error: unknown, event: H3Event): void {
    const normalizedError = this.normalizeError(error);
    sendError(event, normalizedError);
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
