const dynamicRouteSymbol = Symbol('dynamicRoute');

export class RouterNode {
  private readonly nodes: Record<string | symbol, RouterNode> = {};

  public makeRouteNodesByRouteParts(routeParts: string[]): RouterNode {
    let currentNode: RouterNode = this;
    const convertedRouteParts = this.convertRouteParts(routeParts);

    for (const routePart of convertedRouteParts) {
      currentNode = currentNode.getOrCreateRouteNode(routePart);
    }

    return currentNode;
  }

  public findNodeByPathParts(pathParts: string[]): RouterNode | null {
    let currentNode: RouterNode = this;
    for (const pathPart of pathParts) {
      const node = currentNode.getNodeChildByRoutePart(pathPart);
      if (!node) {
        return null;
      }
      currentNode = node;
    }
    return currentNode;
  }

  private convertRouteParts(routeParts: string[]): (string | symbol)[] {
    const parts: (string | symbol)[] = [];
    for (const routePart of routeParts) {
      if (routePart.startsWith(':')) {
        parts.push(dynamicRouteSymbol);
      } else {
        parts.push(routePart);
      }
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

  private getNodeChildByRoutePart(pathPart: string): RouterNode | null {
    let foundNode = this.nodes[pathPart] ?? null;

    if (!foundNode) {
      foundNode = this.nodes[dynamicRouteSymbol] ?? null;
    }

    return foundNode;
  }
}
