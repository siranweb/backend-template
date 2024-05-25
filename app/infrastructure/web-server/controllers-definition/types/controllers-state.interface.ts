import { ControllerPrototype, HandlerFunc } from '@/infrastructure/web-server/types/shared';
import { HTTPMethod } from 'h3';
import { IChainHandler } from '@/infrastructure/web-server/types/chain-handler.interface';
import { ZodType } from 'zod';
import type { oas31 } from 'zod-openapi/lib-types/openapi3-ts/dist';

export interface IControllersState {
  getControllerDef(controller: ControllerPrototype): ControllerDef | null;
  setControllerPrefix(controller: ControllerPrototype, prefix: string): void;
  addControllerChain(controller: ControllerPrototype, chain: IChainHandler[]): void;
  addControllerResponse(controller: ControllerPrototype, openApiResponse: OpenApiResponse): void;
  setHandlerPath(controller: ControllerPrototype, handler: Handler, path: string): void;
  addHandlerChain(controller: ControllerPrototype, handler: Handler, chain: IChainHandler[]): void;
  setHandlerMethod(controller: ControllerPrototype, handler: Handler, method: HTTPMethod): void;
  setHandlerRequestBody(
    controller: ControllerPrototype,
    handler: Handler,
    openApiBody: OpenApiBody,
  ): void;
  setHandlerParams(controller: ControllerPrototype, handler: Handler, openApiParams: ZodType): void;
  setHandlerQuery(controller: ControllerPrototype, handler: Handler, openApiQuery: ZodType): void;
  setHandlerCookie(controller: ControllerPrototype, handler: Handler, openApiCookie: ZodType): void;
  setHandlerHeader(controller: ControllerPrototype, handler: Handler, openApiHeader: ZodType): void;
  addHandlerResponse(
    controller: ControllerPrototype,
    handler: Handler,
    openApiResponse: OpenApiResponse,
  ): void;
}

export type Handler = HandlerFunc;

export type ControllerDef = {
  controller: ControllerPrototype;
  handlers: Map<Handler, HandlerDef>;
  prefix: string;
  chain: IChainHandler[];
  openApiResponses: OpenApiResponse[];
};

export type HandlerDef = {
  handler: Handler;
  path: string;
  chain: IChainHandler[];
  method: HTTPMethod;
  openApiResponses: OpenApiResponse[];
  openApiBody?: OpenApiBody;
  openApiParams?: ZodType;
  openApiQuery?: ZodType;
  openApiCookie?: ZodType;
  openApiHeader?: ZodType;
};

export type OpenApiResponse = {
  statusCode: number;
  contentType: string;
  schema?: ZodType | oas31.SchemaObject;
};

export type OpenApiBody = {
  contentType: string;
  schema?: ZodType | oas31.SchemaObject;
};
