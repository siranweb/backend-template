import { HandlerFunc, ChainFunc, IChainHandler } from '@/lib/web-server';
import { ZodType } from 'zod';
import type { oas31 } from 'zod-openapi/lib-types/openapi3-ts/dist';

export interface IControllerDefinition {
  handlers: HandlerState[];
  controller: ControllerState;
  updateControllerDefinition(fields: UpdateControllerDefinitionFields): void;
  updateHandlerDefinition(handler: HandlerFunc, fields: HandlerStateUpdateFields): void;
}

export type HandlerState = {
  handler: HandlerFunc;
  method: string;
  path?: string;
  chain?: (ChainFunc | IChainHandler)[];
  openApiRequest: OpenApiRequest;
  openApiResponses: OpenApiResponse[];
};

export type HandlerStateUpdateFields = Partial<Omit<HandlerState, 'openApiResponses'>> & {
  openApiResponse?: OpenApiResponse;
};

export type OpenApiRequest = {
  params?: ZodType;
  body?: {
    description: string;
    contentType: string;
    schema: ZodType | oas31.SchemaObject | oas31.ReferenceObject;
  };
  search?: ZodType;
  description?: string;
  summary?: string;
};

export type OpenApiResponse = {
  code?: number;
  contentType?: string;
  description?: string;
  result?: ZodType;
};

export type ControllerState = {
  prefix?: string;
  tags?: string[];
};

export type UpdateControllerDefinitionFields = {
  prefix?: string;
  tags?: string[];
};
