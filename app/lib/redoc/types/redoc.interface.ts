import {
  ZodObjectInputType,
  ZodOpenApiObject,
  ZodOpenApiPathsObject,
} from 'zod-openapi/lib-types/create/document';
import { TagObject } from 'zod-openapi/lib-types/openapi3-ts/dist/model/openapi31';
import { AvailableMethod } from './shared';
import { ZodType } from 'zod';
import { oas31 } from 'zod-openapi';

export interface IRedoc {
  make(): string;
  addPath(path: string, method: AvailableMethod, routeParams: RouteParams): void;
}

export type Spec = Omit<ZodOpenApiObject, 'paths' | 'tags'> & {
  paths: ZodOpenApiPathsObject;
  tags: TagObject[];
};

export type RouteParams = {
  tags?: string[];
  summary?: string;
  description?: string;
  body?: {
    description?: string;
    schema: ZodType | oas31.SchemaObject | oas31.ReferenceObject;
    contentType: string;
  };
  queryParams?: ZodObjectInputType;
};
