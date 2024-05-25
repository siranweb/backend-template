import { HTTPMethod } from 'h3';
import {
  ControllerDef,
  Handler,
  HandlerDef,
  IControllersState,
} from '@/infrastructure/web-server/controllers-definition/types/controllers-state.interface';
import { ControllerPrototype } from '@/infrastructure/web-server/types/shared';
import { IChainHandler } from '@/infrastructure/web-server/types/chain-handler.interface';

class ControllersState implements IControllersState {
  private readonly controllers: Map<ControllerPrototype, ControllerDef> = new Map();

  public getControllerDef(controller: ControllerPrototype): ControllerDef | null {
    const controllerDef = this.controllers.get(controller);
    return controllerDef ?? null;
  }

  public setControllerChain(controller: ControllerPrototype, chain: IChainHandler[]): void {
    const controllerDef = this.getOrInitControllerDef(controller);
    controllerDef.chain = chain;
  }

  public setControllerPrefix(controller: ControllerPrototype, prefix: string): void {
    const controllerDef = this.getOrInitControllerDef(controller);
    controllerDef.prefix = prefix;
  }

  public setHandlerChain(
    controller: ControllerPrototype,
    handler: Handler,
    chain: IChainHandler[],
  ): void {
    const handlerDef = this.getOrInitHandlerDef(controller, handler);
    handlerDef.chain = chain;
  }

  public setHandlerMethod(
    controller: ControllerPrototype,
    handler: Handler,
    method: HTTPMethod,
  ): void {
    const handlerDef = this.getOrInitHandlerDef(controller, handler);
    handlerDef.method = method;
  }

  public setHandlerPath(controller: ControllerPrototype, handler: Handler, path: string): void {
    const handlerDef = this.getOrInitHandlerDef(controller, handler);
    handlerDef.path = path;
  }

  private getOrInitControllerDef(controller: ControllerPrototype): ControllerDef {
    let controllerDef = this.controllers.get(controller);
    if (controllerDef) {
      return controllerDef;
    }

    controllerDef = {
      controller,
      handlers: new Map(),
      prefix: '',
      chain: [],
    };
    this.controllers.set(controller, controllerDef);

    return controllerDef;
  }

  private getOrInitHandlerDef(controller: ControllerPrototype, handler: Handler): HandlerDef {
    const controllerDef = this.getOrInitControllerDef(controller);
    let handlerDef = controllerDef.handlers.get(handler);
    if (handlerDef) {
      return handlerDef;
    }

    handlerDef = {
      handler,
      path: '',
      chain: [],
      method: 'GET',
    };

    controllerDef.handlers.set(handler, handlerDef);

    return handlerDef;
  }
}

export const controllersState = new ControllersState();
