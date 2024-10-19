import { Controller } from '@/common/types/controller.types';
import {
  IControllersState,
  UpdateControllerDef,
} from '@/lib/controller-tools/types/controllers-state.interface';

export function createController(controllersState: IControllersState) {
  /* Describe controller */
  return function Controller(prefix?: string) {
    return (controller: Controller): void => {
      const def: UpdateControllerDef = {};
      if (prefix) {
        def.prefix = prefix;
      }

      if (prefix) {
        controllersState.updateControllerState(controller.prototype, def);
      }
    };
  };
}
