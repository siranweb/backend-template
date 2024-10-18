import { ControllerPrototype, HandlerFunc } from '@/common/types/controller.types';
import { IControllersState } from '@/lib/controller-tools/types/controllers-state.interface';
import { ZodType } from 'zod';

export function createQuery(controllersState: IControllersState) {
  /* Describe query for handler */
  return function Query(...schemas: ZodType[]) {
    return (controller: ControllerPrototype, property: string): void => {
      const handler: HandlerFunc = controller[property];
      controllersState.updateHandlerState(controller, handler, { queries: schemas });
    };
  };
}
