import { ZodIssue } from 'zod';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

export enum ApiErrorType {
  HTTP = 'http',
  APP = 'app',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown',
}

interface ApiErrorParams {
  errorName: string;
  statusCode: number;
  type: ApiErrorType;
  data?: Record<any, any>;
  original?: any;
}

export class ApiError extends Error {
  public readonly errorName: string;
  public readonly statusCode: number;
  public readonly type: ApiErrorType;
  public readonly data: Record<any, any>;
  public readonly original?: any;

  constructor(params: ApiErrorParams) {
    super(params.errorName);
    this.errorName = params.errorName;
    this.statusCode = params.statusCode;
    this.type = params.type;
    this.data = params.data ?? {};
    this.original = params.original;
  }

  static createAsUnknownError(params: Pick<ApiErrorParams, 'original'>): ApiError {
    return new ApiError({
      type: ApiErrorType.UNKNOWN,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      errorName: 'UNKNOWN',
      original: params.original,
    });
  }

  static createAsHttpError(params: Pick<ApiErrorParams, 'statusCode'>): ApiError {
    return new ApiError({
      type: ApiErrorType.HTTP,
      statusCode: params.statusCode,
      errorName: ApiError.convertPhraseToErrorName(getReasonPhrase(params.statusCode)),
    });
  }

  static createAsValidationError(params: { issues: ZodIssue[] }): ApiError {
    return new ApiError({
      type: ApiErrorType.VALIDATION,
      statusCode: StatusCodes.BAD_REQUEST,
      errorName: 'VALIDATION_NOT_PASSED',
      data: {
        issues: params.issues,
      },
    });
  }

  static createAsAppError(params: Pick<ApiErrorParams, 'errorName' | 'data'>): ApiError {
    return new ApiError({
      type: ApiErrorType.APP,
      statusCode: StatusCodes.BAD_REQUEST,
      errorName: params.errorName,
      data: params.data,
    });
  }

  static convertPhraseToErrorName = (phrase: string) => {
    return phrase.toUpperCase().replaceAll(' ', '_');
  };
}
