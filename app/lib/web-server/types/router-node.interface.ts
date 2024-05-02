export interface IRouterNode {
  makeRouteNodesByRouteParts(routeParts: string[]): IRouterNode;
  findNodeByPathParts(pathParts: string[]): IRouterNode | null;
}
