import { ControllerPrototype, HandlerFunc } from '@/common/types/controller.types';
import { IControllersState } from '@/lib/controller-tools/types/controllers-state.interface';
import { ZodType } from 'zod';

export function createHeader(controllersState: IControllersState) {
  return function Header(schema: ZodType) {
    return (controller: ControllerPrototype, property: string): void => {
      const handler: HandlerFunc = controller[property];
      controllersState.setHandlerHeader(controller, handler, schema);
    };
  };
}
