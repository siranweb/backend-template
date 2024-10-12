import { Controller, ControllerPrototype, HandlerFunc } from '@/common/types/controller.types';
import { IControllersState } from '@/lib/controller-tools/types/controllers-state.interface';
import { IChainHandler } from '@/infrastructure/web-api/types/chain-handler.interface';

export function createChain(controllersState: IControllersState) {
  return function Chain(...chain: IChainHandler[]) {
    return (controller: ControllerPrototype | Controller, property?: string): void => {
      if (property) {
        const handler: HandlerFunc = controller[property];
        controllersState.addHandlerChain(controller, handler, chain);
      } else {
        controllersState.addControllerChain(controller.prototype, chain);
      }
    };
  };
}
