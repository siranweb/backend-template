import { HTTPMethod } from 'h3';
import { ControllerPrototype, HandlerFunc } from '@/common/types/controller.types';
import { IControllersState } from '@/lib/controller-tools/types/controllers-state.interface';

export function createHandler(controllersState: IControllersState) {
  return function Handler(method: HTTPMethod, path?: string) {
    return (controller: ControllerPrototype, property: string): void => {
      const handler: HandlerFunc = controller[property];

      controllersState.setHandlerMethod(controller, handler, method);
      if (path) {
        controllersState.setHandlerPath(controller, handler, path);
      }
    };
  };
}
