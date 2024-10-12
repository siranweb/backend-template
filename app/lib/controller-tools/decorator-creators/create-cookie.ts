import { ControllerPrototype, HandlerFunc } from '@/common/types/controller.types';
import { IControllersState } from '@/lib/controller-tools/types/controllers-state.interface';
import { ZodType } from 'zod';

export function createCookie(controllersState: IControllersState) {
  return function Cookie(schema: ZodType) {
    return (controller: ControllerPrototype, property: string): void => {
      const handler: HandlerFunc = controller[property];
      controllersState.setHandlerCookie(controller, handler, schema);
    };
  };
}
