import { ChainFunc, HandlerFunc } from '@/lib/web-server/types/shared';
import { ControllerDefinition } from '@/modules/common/definitions/controller/controller-definition';
import { IControllerDefinition } from '@/modules/common/interfaces/controller-definition.interface';

export function createControllerDefinition() {
  const definition: IControllerDefinition = new ControllerDefinition();

  function Handler(method: string, path?: string) {
    return (target: any, field: string): void => {
      const handler: HandlerFunc = target[field];
      definition.updateHandlerDefinition(handler, { method, path });
    };
  }

  function Chain(...chain: ChainFunc[]) {
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
