export interface IApiError {
  errorName: string;
  statusCode: number;
  type: ApiErrorType;
  data: Record<any, any>;
  original?: any;
}

export enum ApiErrorType {
  APP = 'app',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown',
}

export type ApiErrorParams = {
  statusCode: number;
  errorName?: string | number;
  type: ApiErrorType;
  data?: Record<any, any>;
  original?: any;
};
