export enum ErrorType {
  HTTP = 'http',
  APP = 'app',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown',
}

interface Params {
  statusCode: number;
  errorName?: string | number;
  type: ErrorType;
  data?: Record<any, any>;
  original?: any;
}

export class ApiError extends Error {
  public readonly errorName: string;
  public readonly statusCode: number;
  public readonly type: ErrorType;
  public readonly data: Record<any, any>;
  public readonly original?: any;

  constructor(params: Params) {
    super((params.errorName ?? params.statusCode).toString());
    this.errorName = (params.errorName ?? params.statusCode).toString();
    this.statusCode = params.statusCode;
    this.type = params.type;
    this.data = params.data ?? {};
    this.original = params.original;
  }
}
