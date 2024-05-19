import { ControllerDefinition } from '@/infrastructure/web-server/controller-definitions/controller-definition';
import { IControllerDefinition } from '@/infrastructure/web-server/types/controller-definition.interface';
import { HTTPMethod } from 'h3';
import { HandlerFunc, IChainHandler } from '@/infrastructure/web-server/types/shared';

export function createControllerDefinition() {
  const definition: IControllerDefinition = new ControllerDefinition();

  function Handler(method: HTTPMethod, path?: string) {
    return (target: any, field: string): void => {
      const handler: HandlerFunc = target[field];
      definition.updateHandlerDefinition(handler, { method, path });
    };
  }

  function Chain(...chain: IChainHandler[]) {
    return (target: any, field: string): void => {
      const handler: HandlerFunc = target[field];
      definition.updateHandlerDefinition(handler, { chain });
    };
  }

  function Controller(prefix?: string) {
    return (_target: any): void => {
      definition.updateControllerDefinition({ prefix });
    };
  }

  return { definition, Handler, Chain, Controller };
}
