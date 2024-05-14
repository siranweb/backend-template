import { ChainFunc, HandlerFunc, IChainHandler } from '@/lib/web-server/types/shared';
import {
  ControllerState,
  HandlerState,
  HandlerStateUpdateFields,
  IControllerDefinition,
  OpenApiRequest,
  UpdateControllerDefinitionFields,
} from '@/modules/common/types/controller-definition.interface';
import { HttpMethod } from '@/modules/common/types/http-method';

export class ControllerDefinition implements IControllerDefinition {
  private readonly controllerState: ControllerState = {};
  private readonly handlersState: Map<HandlerFunc, HandlerState> = new Map();

  get handlers(): HandlerState[] {
    return Array.from(this.handlersState.values());
  }

  get controller(): ControllerState {
    return this.controllerState;
  }

  public updateHandlerDefinition(handler: HandlerFunc, fields: HandlerStateUpdateFields): void {
    const definition = this.getOrInitHandler(handler);
    const { openApiResponse, ...straightforwardFields } = fields;
    Object.assign(definition, straightforwardFields);

    if (openApiResponse) {
      definition.openApiResponses.push(openApiResponse);
    }
  }

  public updateHandlerMethod(handler: HandlerFunc, method: HttpMethod): void {
    const definition = this.getOrInitHandler(handler);
    definition.method = method;
  }

  public updateHandlerPath(handler: HandlerFunc, path: string): void {
    const definition = this.getOrInitHandler(handler);
    definition.path = path;
  }

  public updateHandlerChain(handler: HandlerFunc, chain: (ChainFunc | IChainHandler)[]): void {
    const definition = this.getOrInitHandler(handler);
    definition.chain = chain;
  }

  public updateHandlerOpenApiRequest(handler: HandlerFunc, openApi: OpenApiRequest): void {
    const definition = this.getOrInitHandler(handler);
    definition.openApiRequest = openApi;
  }

  public updateControllerDefinition(fields: UpdateControllerDefinitionFields): void {
    this.controllerState.prefix = fields.prefix ?? this.controllerState.prefix;
    this.controllerState.tags = fields.tags ?? this.controllerState.tags;
  }

  private getOrInitHandler(handler: HandlerFunc): HandlerState {
    const handlerDescription = this.handlersState.get(handler);
    if (handlerDescription) return handlerDescription;

    const newHandlerDescription: HandlerState = {
      handler,
      method: '',
      openApiRequest: {},
      openApiResponses: [],
    };
    this.handlersState.set(handler, newHandlerDescription);

    return newHandlerDescription;
  }
}
