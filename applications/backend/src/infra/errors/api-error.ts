import { ZodIssue } from 'zod';

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

  static createFromUnknownError(params: Pick<ApiErrorParams, 'original'>): ApiError {
    return new ApiError({
      type: ApiErrorType.UNKNOWN,
      statusCode: 500,
      errorName: 'UNKNOWN',
      original: params.original,
    });
  }

  static createFromHttpError(params: Pick<ApiErrorParams, 'statusCode'>): ApiError {
    return new ApiError({
      type: ApiErrorType.HTTP,
      statusCode: params.statusCode,
      errorName: params.statusCode.toString(),
    });
  }

  static createFromValidationError(params: { issues: ZodIssue[] }): ApiError {
    return new ApiError({
      type: ApiErrorType.VALIDATION,
      statusCode: 400,
      errorName: 'VALIDATION_NOT_PASSED',
      data: {
        issues: params.issues,
      },
    });
  }

  static createFromAppError(params: Pick<ApiErrorParams, 'errorName' | 'data'>): ApiError {
    return new ApiError({
      type: ApiErrorType.APP,
      statusCode: 400,
      errorName: params.errorName,
      data: params.data,
    });
  }

  static convertPhraseToErrorName = (phrase: string) => {
    return phrase.toUpperCase().replaceAll(' ', '_');
  };
}
