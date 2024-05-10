import { HandlerFunc, ChainFunc, IChainHandler } from '@/lib/web-server';
import { ZodSchema } from 'zod';

export interface IControllerDefinition {
  handlers: HandlerState[];
  controller: ControllerState;
  updateHandlerDefinition(handler: HandlerFunc, fields: UpdateHandlerDefinitionFields): void;
  updateControllerDefinition(fields: UpdateControllerDefinitionFields): void;
}

export type HandlerState = {
  handler: HandlerFunc;
  method: string;
  path?: string;
  chain?: (ChainFunc | IChainHandler)[];
  openApiRoute?: OpenApiRoute;
  openApiResults?: OpenApiResult[];
};

export type OpenApiRoute = {
  params?: ZodSchema;
  body?: ZodSchema;
  search?: ZodSchema;
  description?: string;
};

export type OpenApiResult = {
  code: number;
  description?: string;
  result?: ZodSchema;
};

export type ControllerState = {
  prefix?: string;
};

export type UpdateHandlerDefinitionFields = {
  method?: string;
  path?: string;
  chain?: (ChainFunc | IChainHandler)[];
  openApiRoute?: OpenApiRoute;
  openApiResult?: OpenApiResult;
};

export type UpdateControllerDefinitionFields = {
  prefix?: string;
};
