import { createDocument, ZodOpenApiResponseObject } from 'zod-openapi';
import {
  IOpenApiBuilder,
  OpenApiMethod,
  PathSpecs,
  BodySpec,
  ResponseSpec,
  BuildResult,
  OpenApiStatusCode,
  ParamType,
} from '@/lib/open-api/types/open-api-builder.interface';
import { ZodOpenApiObject, ZodOpenApiOperationObject, ZodOpenApiPathItemObject } from 'zod-openapi';
import { ZodType } from 'zod';

export class OpenApiBuilder implements IOpenApiBuilder {
  private readonly spec: ZodOpenApiObject = {
    openapi: '3.1.0',
    info: {
      title: 'Title',
      description: 'Description',
      version: '',
    },
    paths: {},
  };

  public build(): BuildResult {
    return createDocument(this.spec);
  }

  public setInfo(info: ZodOpenApiObject['info']): void {
    this.spec.info = info;
  }

  public addPath(method: OpenApiMethod, path: string, specs: PathSpecs): void {
    const pathObj = this.getOrInitPathObj(path);
    const methodObj = this.initMethodObj(pathObj, method);

    if (specs.responses) {
      specs.responses.forEach((responseSpec) => this.addResponse(methodObj, responseSpec));
    }

    if (specs.bodies) {
      specs.bodies.forEach((bodySpec) => this.addBody(methodObj, bodySpec));
    }

    if (specs.queries) {
      specs.queries.forEach((schema) => this.addParam(methodObj, 'query', schema));
    }

    if (specs.params) {
      specs.params.forEach((schema) => this.addParam(methodObj, 'path', schema));
    }

    if (specs.cookies) {
      specs.cookies.forEach((schema) => this.addParam(methodObj, 'cookie', schema));
    }

    if (specs.headers) {
      specs.headers.forEach((schema) => this.addParam(methodObj, 'header', schema));
    }
  }

  private addResponse(methodObj: ZodOpenApiOperationObject, responseSpec: ResponseSpec): void {
    const statusCode = responseSpec.statusCode.toString() as OpenApiStatusCode;

    if (!methodObj.responses[statusCode]) {
      methodObj.responses[statusCode] = {
        description: '',
      };
    }
    const statusResponseObj = methodObj.responses[statusCode]! as ZodOpenApiResponseObject;

    if (!statusResponseObj.content) {
      statusResponseObj.content = {};
    }
    const content = statusResponseObj.content;

    if (!content[responseSpec.contentType]) {
      content[responseSpec.contentType] = {};
    }
    const contentTypeObj = content[responseSpec.contentType]!;

    if (!contentTypeObj.schema) {
      contentTypeObj.schema = responseSpec.schema;
    } else {
      if (responseSpec.schema) {
        (contentTypeObj.schema as ZodType).or(responseSpec.schema);
      }
    }
  }

  private addBody(methodObj: ZodOpenApiOperationObject, bodySpec: BodySpec): void {
    if (!methodObj.requestBody) {
      methodObj.requestBody = {
        content: {},
      };
    }
    const content = methodObj.requestBody.content;

    if (!content[bodySpec.contentType]) {
      content[bodySpec.contentType] = {};
    }
    const contentTypeObj = content[bodySpec.contentType]!;

    if (!contentTypeObj.schema) {
      contentTypeObj.schema = bodySpec.schema;
    } else {
      if (bodySpec.schema) {
        (contentTypeObj.schema as ZodType).or(bodySpec.schema);
      }
    }
  }

  private addParam(methodObj: ZodOpenApiOperationObject, type: ParamType, schema: ZodType): void {
    if (!methodObj.requestParams) {
      methodObj.requestParams = {};
    }

    if (!methodObj.requestParams[type]) {
      methodObj.requestParams[type] = schema;
    } else {
      (methodObj.requestParams[type] as ZodType).or(schema);
    }
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
