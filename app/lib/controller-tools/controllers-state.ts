import {
  ControllerDef,
  Handler,
  HandlerDef,
  IControllersState,
  UpdateControllerDef,
  UpdateHandlerDef,
} from '@/lib/controller-tools/types/controllers-state.interface';
import { ControllerPrototype } from '@/common/types/controller.types';
export class ControllersState implements IControllersState {
  private readonly controllers: Map<ControllerPrototype, ControllerDef> = new Map();

  public getControllerDef(controller: ControllerPrototype): ControllerDef | null {
    const controllerDef = this.controllers.get(controller);
    return controllerDef ?? null;
  }

  public updateControllerState(controller: ControllerPrototype, def: UpdateControllerDef): void {
    const controllerDef = this.getOrInitControllerDef(controller);

    if (def.prefix) {
      controllerDef.prefix = def.prefix;
    }
    if (def.tags) {
      controllerDef.tags.push(...def.tags);
    }
    if (def.chain) {
      controllerDef.chain.push(...def.chain);
    }
    if (def.responses) {
      controllerDef.responses.push(...def.responses);
    }
  }

  public updateHandlerState(
    controller: ControllerPrototype,
    handler: Handler,
    def: UpdateHandlerDef,
  ): void {
    const handlerDef = this.getOrInitHandlerDef(controller, handler);

    if (def.path) {
      handlerDef.path = def.path;
    }
    if (def.method) {
      handlerDef.method = def.method;
    }
    if (def.chain) {
      handlerDef.chain.push(...def.chain);
    }
    if (def.responses) {
      handlerDef.responses.push(...def.responses);
    }
    if (def.bodies) {
      handlerDef.bodies.push(...def.bodies);
    }
    if (def.params) {
      handlerDef.params.push(...def.params);
    }
    if (def.queries) {
      handlerDef.queries.push(...def.queries);
    }
    if (def.cookies) {
      handlerDef.cookies.push(...def.cookies);
    }
    if (def.headers) {
      handlerDef.headers.push(...def.headers);
    }
  }

  private getOrInitControllerDef(controller: ControllerPrototype): ControllerDef {
    let controllerDef: ControllerDef | undefined = this.controllers.get(controller);
    if (controllerDef) {
      return controllerDef;
    }

    controllerDef = {
      controller,
      handlers: new Map(),
      prefix: '',
      chain: [],
      tags: [],
      responses: [],
    };
    this.controllers.set(controller, controllerDef);

    return controllerDef;
  }

  private getOrInitHandlerDef(controller: ControllerPrototype, handler: Handler): HandlerDef {
    const controllerDef: ControllerDef = this.getOrInitControllerDef(controller);
    let handlerDef: HandlerDef | undefined = controllerDef.handlers.get(handler);
    if (handlerDef) {
      return handlerDef;
    }

    handlerDef = {
      handler,
      path: '',
      chain: [],
      method: 'GET',
      responses: [],
      bodies: [],
      params: [],
      queries: [],
      cookies: [],
      headers: [],
    };

    controllerDef.handlers.set(handler, handlerDef);

    return handlerDef;
  }
}
