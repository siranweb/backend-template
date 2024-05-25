import { HTTPMethod } from 'h3';
import { HandlerFunc, ControllerPrototype } from '@/infrastructure/web-server/types/shared';
import { controllersState } from '@/infrastructure/web-server/controllers-definition/controllers-state';
import { IChainHandler } from '@/infrastructure/web-server/types/chain-handler.interface';

export function Handler(method: HTTPMethod, path?: string) {
  return (controller: ControllerPrototype, property: string): void => {
    const handler: HandlerFunc = controller[property];

    controllersState.setHandlerMethod(controller, handler, method);
    if (path) {
      controllersState.setHandlerPath(controller, handler, path);
    }
  };
}

export function Controller(prefix?: string) {
  return (controller: ControllerPrototype): void => {
    if (prefix) {
      controllersState.setControllerPrefix(controller.prototype, prefix);
    }
  };
}

export function Chain(...chain: IChainHandler[]) {
  return (controller: ControllerPrototype, property?: string): void => {
    if (property) {
      const handler: HandlerFunc = controller[property];
      controllersState.setHandlerChain(controller, handler, chain);
    } else {
      controllersState.setControllerChain(controller.prototype, chain);
    }
  };
}
