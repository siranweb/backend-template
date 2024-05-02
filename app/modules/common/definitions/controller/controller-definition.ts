import { HandlerFunc } from '@/lib/web-server/types/shared';
import {
  ControllerState,
  HandlerState,
  IControllerDefinition, UpdateHandlerDefinitionFields,
} from '@/modules/common/interfaces/controller-definition.interface';

export class ControllerDefinition implements IControllerDefinition {
  private readonly controllerState: ControllerState = {};
  private readonly handlersState: Map<HandlerFunc, HandlerState> = new Map();

  get handlers(): HandlerState[] {
    return Array.from(this.handlersState.values());
  }

  get controller(): ControllerState {
    return this.controllerState;
  }

  public updateHandlerDescription(handler: HandlerFunc, fields: UpdateHandlerDefinitionFields): void {
    const description = this.getOrInitHandler(handler);

    description.chain = fields.chain ?? description.chain;
    description.method = fields.method ?? description.method;
    description.path = fields.path ?? description.path;
  }

  private getOrInitHandler(handler: HandlerFunc): HandlerState {
    const handlerDescription = this.handlersState.get(handler);
    if (handlerDescription) return handlerDescription;

    const newHandlerDescription = { handler, method: '', };
    this.handlersState.set(handler, newHandlerDescription);

    return newHandlerDescription;
  }
}
