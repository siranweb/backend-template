export interface IRouter {
  register(method: string, route: string, handler: any): void;
  getMethods(url: string): string[];
  resolve(method: string, url: string): ResolvedRoute | null;
}

export type ResolvedRoute = {
  route: string;
  handler: any;
  params: Record<string, string>;
  search: Record<string, any>;
};

export type RouteWithHandler = {
  route: string;
  handler: any;
};

export type StoredRoutes = {
  routes: Record<string, RouteWithHandler>;
};
