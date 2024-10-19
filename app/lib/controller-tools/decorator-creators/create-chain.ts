import { Controller, ControllerPrototype, HandlerFunc } from '@/common/types/controller.types';
import { IControllersState } from '@/lib/controller-tools/types/controllers-state.interface';
import { IChainHandler } from '@/infrastructure/controllers-state/types/chain-handler.interface';

export function createChain(controllersState: IControllersState) {
  /* Describe chain for handler or whole controller */
  return function Chain(...chain: IChainHandler[]) {
    return (controller: ControllerPrototype | Controller, property?: string): void => {
      if (property) {
        const handler: HandlerFunc = controller[property];
        controllersState.updateHandlerState(controller, handler, { chain });
      } else {
        controllersState.updateControllerState(controller.prototype, { chain });
      }
    };
  };
}
