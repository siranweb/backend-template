export class AppError extends Error {
  public readonly name: string;
  public readonly data: Record<any, any>;

  constructor(name: string, data: Record<any, any> = {}) {
    super();
    this.name = name;
    this.data = data;
  }
}
