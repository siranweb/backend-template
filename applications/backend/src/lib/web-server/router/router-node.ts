import { IncomingMessage, ServerResponse } from 'node:http';

export interface Context<Store extends Record<any, any>> {
  req: IncomingMessage;
  res: ServerResponse;
  store: Store;
}
export type RouteHandler<Store extends Record<any, any>> = (context: Context<Store>) => any;

interface RoutePathInfo {
  route: string | null;
  node: RouterNode | null;
  handler: RouteHandler<any> | null;
  url: string;
  params: Record<string, string>;
  search: Record<string, any>;
}

const dynamicRouteSymbol = Symbol('dynamicRoute');

export class RouterNode {
  private readonly handlers: Record<string, {
    route: string;
    handler: RouteHandler<any>;
  }> = {};
  private readonly nodes: Record<string | symbol, RouterNode> = {};

  public register(method: string, route: string, handler: RouteHandler<any>): void {
    method = method.toUpperCase();
    route = route.endsWith('/') ? route.substring(0, route.length - 1) : route;
    const node = this.makeRouteNodesByRoute(route);
    if (node.handlers[method]) {
      throw new Error(`Attempt to register route ${route} twice with ${method} method`);
    }
    node.handlers[method] = {
      handler,
      route,
    };
  }

  public get(method: string, url: string): RoutePathInfo {
    let foundNode: RouterNode | null = null;
    const params = Object.create(null);
    const { pathname, searchParams } = new URL(url, 'resolve://');
    const pathParts = this.splitPathToParts(pathname);

    let currentNode: RouterNode = this;
    for (const pathPart of pathParts) {
      const node = currentNode.getNodeWithRoutePart(pathPart);
      if (!node) {
        foundNode = null;
        break;
      }
      currentNode = node;
      foundNode = node;
    }

    const route = foundNode?.handlers[method].route;
    if (route) {
      const routeStringParts = route.split('/').filter(part => !!part);
      for (const routePartIndex in routeStringParts) {
        const routePart = routeStringParts[routePartIndex];
        if (routePart.startsWith(':')) {
          const param = routePart.substring(1);
          params[param] = pathParts[routePartIndex];
        }
      }
    }

    return {
      route: foundNode?.handlers[method].route ?? null,
      url,
      node: foundNode,
      handler: foundNode?.handlers[method].handler ?? null,
      params,
      search: this.parseSearchParams(searchParams),
    };
  }

  private makeRouteNodesByRoute(route: string): RouterNode {
    let currentNode: RouterNode = this;
    const routeParts = this.splitRouteToParts(route);

    // if no parts - will return this node
    for (const routePart of routeParts) {
      currentNode = currentNode.getOrCreateRouteNode(routePart);
    }

    return currentNode;
  }

  private splitRouteToParts(route: string): (string | symbol)[] {
    const parts: (string | symbol)[] = [];
    const splitRoute = route.split('/');
    for (const splitRoutePart of splitRoute) {
      if (!splitRoutePart) continue;
      if (splitRoutePart.startsWith(':')) {
        parts.push(dynamicRouteSymbol);
      } else {
        parts.push(splitRoutePart);
      }
    }

    return parts;
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

  private getOrCreateRouteNode(routePart: string | symbol): RouterNode {
    if (this.nodes[routePart]) return this.nodes[routePart];

    const isNormalRoute = typeof routePart === 'string';
    const isDynamicRoute = routePart === dynamicRouteSymbol;

    if (isNormalRoute || isDynamicRoute) {
      this.nodes[routePart] = new RouterNode();
      return this.nodes[routePart];
    } else {
      throw new Error(`Unhandled route part: ${routePart.toString()}`);
    }
  }

  private getNodeWithRoutePart(pathPart: string): RouterNode | null {
    let foundNode: RouterNode | null = this.nodes[pathPart] ?? null;

    if (!foundNode) {
      foundNode = this.nodes[dynamicRouteSymbol] ?? null;
    }

    return foundNode;
  }

  private parseSearchParams(searchParams: URLSearchParams): Record<string, any> {
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
}