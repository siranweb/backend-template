import { RouterNode } from './router-node';
import {
  IRouter,
  ResolvedRoute,
  RouteWithHandler,
  StoredRoutes,
} from '../../types/router.interface';
import { IRouterNode } from '@/lib/web-server/types/router-node.interface';

export class Router implements IRouter {
  private readonly tree: IRouterNode = new RouterNode();
  private readonly stored: Map<IRouterNode, StoredRoutes> = new Map();

  public register(method: string, route: string, handler: any): void {
    method = method.toUpperCase();
    const routeParts = this.splitRouteToParts(route);
    const formattedRoute = `/${routeParts.join('/')}`;
    const node = this.tree.makeRouteNodesByRouteParts(routeParts);
    this.assignHandler(node, method, formattedRoute, handler);
  }

  public getMethods(url: string): string[] {
    const { pathname } = new URL(url, 'resolve://');
    const pathParts = this.splitPathToParts(pathname);

    const foundNode = this.tree.findNodeByPathParts(pathParts);
    if (!foundNode) return [];

    const storedItem = this.stored.get(foundNode);
    if (!storedItem) return [];

    return Object.keys(storedItem.routes);
  }

  public resolve(method: string, url: string): ResolvedRoute | null {
    const { pathname, searchParams } = new URL(url, 'resolve://');
    const pathParts = this.splitPathToParts(pathname);

    const foundNode = this.tree.findNodeByPathParts(pathParts);
    if (!foundNode) return null;

    const storedItem = this.stored.get(foundNode);
    const handlerInfo = storedItem?.routes[method];
    if (!handlerInfo) return null;

    const { route, handler } = handlerInfo;
    const routeStringParts = this.splitRouteToParts(route);

    const params = this.parseParams(routeStringParts, pathParts);
    const search = this.parseSearch(searchParams);

    return {
      route,
      handler,
      params,
      search,
    };
  }

  private assignHandler(
    node: IRouterNode,
    method: string,
    route: string,
    handler: any,
  ): RouteWithHandler {
    if (!this.stored.has(node)) {
      this.stored.set(node, {
        routes: {},
      });
    }

    const stored = this.stored.get(node) as StoredRoutes;
    if (stored.routes[method]) {
      throw new Error(`Attempt to register route ${route} twice with ${method} method`);
    }
    stored.routes[method] = {
      handler,
      route,
    };

    return stored.routes[method];
  }

  private splitPathToParts(pathname: string): string[] {
    const parts: string[] = [];
    const splitPathname = pathname.split('?')[0].split('/');
    for (const splitPathnamePart of splitPathname) {
      if (!splitPathnamePart) continue;
      parts.push(splitPathnamePart);
    }

    return parts;
  }

  private splitRouteToParts(route: string): string[] {
    const parts: string[] = [];
    const splitRoute = route.split('/');
    for (const splitRoutePart of splitRoute) {
      if (!splitRoutePart) continue;
      parts.push(splitRoutePart);
    }

    return parts;
  }

  private parseSearch(searchParams: URLSearchParams): Record<string, any> {
    const search = Object.create(null);
    for (const entry of searchParams.entries()) {
      const [param, value] = entry;
      if (!search[param]) {
        search[param] = value;
      } else if (!Array.isArray(search[param])) {
        search[param] = [search[param], value];
      } else {
        search[param].push(value);
      }
    }
    return search;
  }

  private parseParams(routeParts: string[], pathParts: string[]): Record<string, string> {
    const params = Object.create(null);
    for (const routePartIndex in routeParts) {
      const routePart = routeParts[routePartIndex];
      if (routePart.startsWith(':')) {
        const param = routePart.substring(1);
        params[param] = pathParts[routePartIndex];
      }
    }
    return params;
  }
}
