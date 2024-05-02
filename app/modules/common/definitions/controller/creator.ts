import { ChainFunc, HandlerFunc } from '@/lib/web-server/types/shared';
import { ControllerDefinition } from '@/modules/common/definitions/controller/controller-definition';
import { IControllerDefinition } from '@/modules/common/interfaces/controller-definition.interface';

export function createControllerDefinition() {
  const definition: IControllerDefinition = new ControllerDefinition();

  function Handler(method: string, path?: string) {
    return (target: any, field: string): void => {
      const handler: HandlerFunc = target[field];
      definition.updateHandlerDescription(handler, { method, path });
    };
  }

  function Chain(...chain: ChainFunc[]) {
    return (target: any, field: string): void => {
      const handler: HandlerFunc = target[field];
      definition.updateHandlerDescription(handler, { chain });
    };
  }

  function Controller(prefix?: string) {
    console.log(prefix);
    return (target: any): void => {
      console.log(target);
    };
  }

  return { definition, Handler, Chain, Controller };
}
