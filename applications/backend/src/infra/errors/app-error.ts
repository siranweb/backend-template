export class AppError extends Error {
  public readonly errorName: string;
  public readonly data: Record<any, any>;

  constructor(errorName: string, data: Record<any, any> = {}) {
    super();
    this.errorName = errorName;
    this.data = data;
  }
}
