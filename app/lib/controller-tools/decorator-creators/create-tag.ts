import { Controller } from '@/common/types/controller.types';
import { IControllersState } from '@/lib/controller-tools/types/controllers-state.interface';

export function createTag(controllersState: IControllersState) {
  /* Describe tag for controller */
  return function Tag(...tags: string[]) {
    return (controller: Controller): void => {
      controllersState.updateControllerState(controller.prototype, { tags });
    };
  };
}
