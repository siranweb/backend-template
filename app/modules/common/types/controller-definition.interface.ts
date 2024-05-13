import { HandlerFunc, ChainFunc, IChainHandler } from '@/lib/web-server';
import { ZodType } from 'zod';

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
  openApiRoute: OpenApiRoute;
  openApiResults: OpenApiResult[];
};

export type OpenApiRoute = {
  params?: ZodType;
  body?: ZodType;
  search?: ZodType;
  description?: string;
  summary?: string;
};

export type OpenApiResult = {
  code?: number;
  contentType?: string;
  description?: string;
  result?: ZodType;
};

export type ControllerState = {
  prefix?: string;
  tags?: string[];
};

export type UpdateHandlerDefinitionFields = {
  method?: string;
  path?: string;
  chain?: (ChainFunc | IChainHandler)[];
  openApiRoute?: OpenApiRoute;
  openApiResult?: OpenApiResult;
  description?: string;
  summary?: string;
  body?: ZodType;
};

export type UpdateControllerDefinitionFields = {
  prefix?: string;
  tags?: string[];
};
