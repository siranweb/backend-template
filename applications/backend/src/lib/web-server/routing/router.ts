import { IncomingMessage, ServerResponse } from 'node:http';
import { RouterNode } from './router-node';

interface Context<Store extends {}> {
  req: IncomingMessage;
  res: ServerResponse;
  store: Store;
}
export type RouteHandler<Store extends {}> = (context: Context<Store>) => any;

interface RoutePathInfo {
  route: string;
  handler: RouteHandler<any>;
  url: string;
  params: Record<string, string>;
  search: Record<string, any>;
}

interface HandlerInfo {
  route: string;
  handler: RouteHandler<any>;
}

interface StoredItem {
  routes: Record<string, HandlerInfo>;
}

export class Router {
  private readonly tree: RouterNode = new RouterNode();
  private readonly stored: Map<RouterNode, StoredItem> = new Map();

  public register(method: string, route: string, handler: RouteHandler<any>): void {
    method = method.toUpperCase();
    const routeParts = this.splitRouteToParts(route);
    const formattedRoute = `/${routeParts.join('/')}`;
    const node = this.tree.makeRouteNodesByRouteParts(routeParts);
    this.assignHandler(node, method, formattedRoute, handler);
  }

  public resolve(method: string, url: string): RoutePathInfo | null {
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
      url,
    };
  }

  private assignHandler(
    node: RouterNode,
    method: string,
    route: string,
    handler: RouteHandler<any>,
  ): HandlerInfo {
    if (!this.stored.has(node)) {
      this.stored.set(node, {
        routes: {},
      });
    }

    const stored = this.stored.get(node) as StoredItem;
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
