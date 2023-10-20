export class RouteNotFoundError extends Error {
  public readonly method: string;
  public readonly path: string;

  constructor(method: string, path: string) {
    super(`Route with method ${method} and path ${path} not found`);
    this.method = method;
    this.path = path;
  }
}