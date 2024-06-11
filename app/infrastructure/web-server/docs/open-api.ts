import { createDocument } from 'zod-openapi';
import {
  IOpenApi,
  OpenApiMethod,
  PathParams,
  RequestBodySpec,
  ResponseSpec,
} from '@/infrastructure/web-server/types/open-api-builder.interface';
import { InfoObject, OpenAPIObject } from 'zod-openapi/lib-types/openapi3-ts/dist/model/openapi31';
import {
  ZodOpenApiObject,
  ZodOpenApiOperationObject,
  ZodOpenApiPathItemObject,
} from 'zod-openapi/lib-types/create/document';
import { ZodType } from 'zod';

export class OpenApi implements IOpenApi {
  private readonly spec: ZodOpenApiObject = {
    openapi: '3.1.0',
    info: {
      title: 'Title',
      description: 'Description',
      version: '',
    },
    paths: {},
  };

  public build(): OpenAPIObject {
    return createDocument(this.spec);
  }

  public setInfo(info: InfoObject): void {
    this.spec.info = info;
  }

  public addPath(method: OpenApiMethod, path: string, params: PathParams = {}): void {
    const pathObj = this.getOrInitPathObj(path);
    const methodObj = this.initMethodObj(pathObj, method);

    if (params.responses) {
      params.responses.forEach((responseSpec) => this.addResponse(methodObj, responseSpec));
    }

    if (params.requestBody) {
      this.addRequestBody(methodObj, params.requestBody);
    }

    if (params.query) {
      this.addQuery(methodObj, params.query);
    }

    if (params.params) {
      this.addParams(methodObj, params.params);
    }

    if (params.cookie) {
      this.addCookie(methodObj, params.cookie);
    }

    if (params.header) {
      this.addHeader(methodObj, params.header);
    }
  }

  private addResponse(methodObj: ZodOpenApiOperationObject, responseSpec: ResponseSpec): void {
    methodObj.responses = {
      [responseSpec.statusCode]: {
        content: {
          [responseSpec.contentType]: {
            schema: responseSpec.schema,
          },
        },
      },
    };
  }

  private addRequestBody(
    methodObj: ZodOpenApiOperationObject,
    requestBodySpec: RequestBodySpec,
  ): void {
    methodObj.requestBody = {
      content: {
        [requestBodySpec.contentType]: {
          schema: requestBodySpec.schema,
        },
      },
    };
  }

  private addQuery(methodObj: ZodOpenApiOperationObject, schema: ZodType): void {
    if (!methodObj.requestParams) {
      methodObj.requestParams = {};
    }
    methodObj.requestParams.query = schema;
  }

  private addParams(methodObj: ZodOpenApiOperationObject, schema: ZodType): void {
    if (!methodObj.requestParams) {
      methodObj.requestParams = {};
    }
    methodObj.requestParams.path = schema;
  }

  private addCookie(methodObj: ZodOpenApiOperationObject, schema: ZodType): void {
    if (!methodObj.requestParams) {
      methodObj.requestParams = {};
    }
    methodObj.requestParams.cookie = schema;
  }

  private addHeader(methodObj: ZodOpenApiOperationObject, schema: ZodType): void {
    if (!methodObj.requestParams) {
      methodObj.requestParams = {};
    }
    methodObj.requestParams.header = schema;
  }

  private getOrInitPathObj(path: string): ZodOpenApiPathItemObject {
    if (!this.spec.paths![path]) {
      this.spec.paths![path] = {};
    }

    return this.spec.paths![path];
  }

  private initMethodObj(
    pathObj: ZodOpenApiPathItemObject,
    method: OpenApiMethod,
  ): ZodOpenApiOperationObject {
    pathObj[method] = {
      responses: {},
    };

    return pathObj[method]!;
  }
}
