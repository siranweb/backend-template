export class ApplicationError extends Error {
  public readonly errorName: string;
  public readonly data: Record<any, any>;

  constructor(errorName: string, data: Record<any, any> = {}) {
    super(errorName);
    this.errorName = errorName;
    this.data = data;
  }
}