import { createError, H3Error, isError as isH3Error } from 'h3';
import { AppError } from '@/common/errors/app-error';

// TODO debug mode (across all app)

export function normalizeApiError(error: unknown): H3Error {
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
