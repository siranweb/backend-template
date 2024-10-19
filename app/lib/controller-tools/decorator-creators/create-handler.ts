import { HTTPMethod } from 'h3';
import { ControllerPrototype, HandlerFunc } from '@/common/types/controller.types';
import {
  IControllersState,
  UpdateHandlerDef,
} from '@/lib/controller-tools/types/controllers-state.interface';

export function createHandler(controllersState: IControllersState) {
  /* Describe handler */
  return function Handler(method: HTTPMethod, path?: string) {
    return (controller: ControllerPrototype, property: string): void => {
      const handler: HandlerFunc = controller[property];

      const def: UpdateHandlerDef = { method };
      if (path) {
        def.path = path;
      }

      controllersState.updateHandlerState(controller, handler, def);
    };
  };
}
