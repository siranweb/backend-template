import { createDocument, ZodOpenApiObject } from 'zod-openapi';
import { ZodType } from 'zod';

export interface IOpenApiBuilder {
  build(): BuildResult;
  setInfo(info: ZodOpenApiObject['info']): void;
  addPath(method: OpenApiMethod, path: string, specs: PathSpecs): void;
}

export type BuildResult = ReturnType<typeof createDocument>;

export type ParamType = 'query' | 'path' | 'cookie' | 'header';

export type PathSpecs = {
  responses: ResponseSpec[];
  tags: string[];
  bodies: BodySpec[];
  queries: ZodType[];
  params: ZodType[];
  cookies: ZodType[];
  headers: ZodType[];
};

export type OpenApiStatusCode = `${1 | 2 | 3 | 4 | 5}${string}`;

export type ResponseSpec = {
  statusCode: number;
  contentType?: string;
  schema?: ZodType;
};

export type BodySpec = {
  contentType: string;
  schema?: ZodType;
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
