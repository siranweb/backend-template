import { HTTPMethod } from 'h3';
import {
  ControllerDef,
  Handler,
  HandlerDef,
  IControllersState,
  OpenApiBody,
  OpenApiResponse,
} from '@/infrastructure/web-server/controllers-definition/types/controllers-state.interface';
import { ControllerPrototype } from '@/infrastructure/web-server/types/shared';
import { IChainHandler } from '@/infrastructure/web-server/types/chain-handler.interface';
import { ZodType } from 'zod';

export class ControllersState implements IControllersState {
  private readonly controllers: Map<ControllerPrototype, ControllerDef> = new Map();

  public getControllerDef(controller: ControllerPrototype): ControllerDef | null {
    const controllerDef = this.controllers.get(controller);
    return controllerDef ?? null;
  }

  public addControllerChain(controller: ControllerPrototype, chain: IChainHandler[]): void {
    const controllerDef = this.getOrInitControllerDef(controller);
    controllerDef.chain.push(...chain);
  }

  public setControllerPrefix(controller: ControllerPrototype, prefix: string): void {
    const controllerDef = this.getOrInitControllerDef(controller);
    controllerDef.prefix = prefix;
  }

  public addControllerResponse(
    controller: ControllerPrototype,
    openApiResponse: OpenApiResponse,
  ): void {
    const controllerDef = this.getOrInitControllerDef(controller);
    controllerDef.openApiResponses.push(openApiResponse);
  }

  public addHandlerChain(
    controller: ControllerPrototype,
    handler: Handler,
    chain: IChainHandler[],
  ): void {
    const handlerDef = this.getOrInitHandlerDef(controller, handler);
    handlerDef.chain.push(...chain);
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

  public addHandlerResponse(
    controller: ControllerPrototype,
    handler: Handler,
    openApiResponse: OpenApiResponse,
  ): void {
    const handlerDef = this.getOrInitHandlerDef(controller, handler);
    handlerDef.openApiResponses.push(openApiResponse);
  }

  public setHandlerRequestBody(
    controller: ControllerPrototype,
    handler: Handler,
    openApiBody: OpenApiBody,
  ): void {
    const handlerDef = this.getOrInitHandlerDef(controller, handler);
    handlerDef.openApiBody = openApiBody;
  }

  public setHandlerParams(
    controller: ControllerPrototype,
    handler: Handler,
    openApiParams: ZodType,
  ): void {
    const handlerDef = this.getOrInitHandlerDef(controller, handler);
    handlerDef.openApiParams = openApiParams;
  }
  public setHandlerQuery(
    controller: ControllerPrototype,
    handler: Handler,
    openApiQuery: ZodType,
  ): void {
    const handlerDef = this.getOrInitHandlerDef(controller, handler);
    handlerDef.openApiQuery = openApiQuery;
  }
  public setHandlerCookie(
    controller: ControllerPrototype,
    handler: Handler,
    openApiCookie: ZodType,
  ): void {
    const handlerDef = this.getOrInitHandlerDef(controller, handler);
    handlerDef.openApiCookie = openApiCookie;
  }
  public setHandlerHeader(
    controller: ControllerPrototype,
    handler: Handler,
    openApiHeader: ZodType,
  ): void {
    const handlerDef = this.getOrInitHandlerDef(controller, handler);
    handlerDef.openApiHeader = openApiHeader;
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
      openApiResponses: [],
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
      openApiResponses: [],
    };

    controllerDef.handlers.set(handler, handlerDef);

    return handlerDef;
  }
}
