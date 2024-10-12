import { Controller } from '@/common/types/controller.types';
import { IControllersState } from '@/lib/controller-tools/types/controllers-state.interface';

export function createController(controllersState: IControllersState) {
  return function Controller(prefix?: string) {
    return (controller: Controller): void => {
      if (prefix) {
        controllersState.setControllerPrefix(controller.prototype, prefix);
      }
    };
  };
}
