import {
  ControllerState,
  HandlerState,
  IControllerDefinition,
  UpdateControllerDefinitionFields,
  UpdateHandlerDefinitionFields,
} from '@/infrastructure/web-server/types/controller-definition.interface';
import { HandlerFunc } from '@/infrastructure/web-server/types/shared';

export class ControllerDefinition implements IControllerDefinition {
  private readonly controllerState: ControllerState = {};
  private readonly handlersState: Map<HandlerFunc, HandlerState> = new Map();

  get handlers(): HandlerState[] {
    return Array.from(this.handlersState.values());
  }

  get controller(): ControllerState {
    return this.controllerState;
  }

  public updateHandlerDefinition(
    handler: HandlerFunc,
    fields: UpdateHandlerDefinitionFields,
  ): void {
    const definition = this.getOrInitHandler(handler);

    definition.chain = fields.chain ?? definition.chain;
    definition.method = fields.method ?? definition.method;
    definition.path = fields.path ?? definition.path;
  }

  public updateControllerDefinition(fields: UpdateControllerDefinitionFields): void {
    this.controllerState.prefix = fields.prefix ?? this.controllerState.prefix;
  }

  private getOrInitHandler(handler: HandlerFunc): HandlerState {
    const handlerDescription = this.handlersState.get(handler);
    if (handlerDescription) return handlerDescription;

    const newHandlerDescription: HandlerState = { handler, method: '', chain: [] };
    this.handlersState.set(handler, newHandlerDescription);

    return newHandlerDescription;
  }
}