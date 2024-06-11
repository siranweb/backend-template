import { InfoObject, OpenAPIObject } from 'zod-openapi/lib-types/openapi3-ts/dist/model/openapi31';
import type { ZodType } from 'zod';
import type { oas31 } from 'zod-openapi/lib-types/openapi3-ts/dist';

export interface IOpenApi {
  build(): OpenAPIObject;
  setInfo(info: InfoObject): void;
  addPath(method: OpenApiMethod, path: string, params?: PathParams): void;
}

export type PathParams = {
  responses?: ResponseSpec[];
  requestBody?: RequestBodySpec;
  query?: ZodType;
  params?: ZodType;
  cookie?: ZodType;
  header?: ZodType;
};

export type ResponseSpec = {
  statusCode: number;
  contentType: string;
  schema?: ZodType | oas31.SchemaObject;
};

export type RequestBodySpec = {
  contentType: string;
  schema?: ZodType | oas31.SchemaObject;
};

export type OpenApiMethod =
  | 'get'
  | 'put'
  | 'post'
  | 'delete'
  | 'options'
  | 'head'
  | 'patch'
  | 'trace';
