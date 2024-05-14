import { ChainFunc, HandlerFunc, IChainHandler } from '@/lib/web-server';
import { ControllerDefinition } from '../../definitions/controller/controller-definition';
import {
  IControllerDefinition,
  OpenApiResponse,
} from '../../types/controller-definition.interface';
import {
  ControllerDecoratorParams,
  OpenApiRequestDecoratorParams,
} from '../../types/controller-definition-decorators.interface';
import { ZodType } from 'zod';

export function createControllerDefinition() {
  const definition: IControllerDefinition = new ControllerDefinition();

  function Controller(params: ControllerDecoratorParams) {
    return (_target: any): void => {
      const { prefix, tags } = params;
      const calculatedTags = prefix ? [prefix.replaceAll('/', '')] : [];
      definition.updateControllerDefinition({ prefix, tags: tags ?? calculatedTags });
    };
  }

  function Handler(method: string, path?: string) {
    return (target: any, field: string): void => {
      const handler: HandlerFunc = target[field];

      const fields: Record<string, any> = { method };
      if (path) {
        fields.path = path;
      }

      definition.updateHandlerDefinition(handler, fields);
    };
  }

  function Chain(...chain: (ChainFunc | IChainHandler)[]) {
    return (target: any, field: string): void => {
      const handler: HandlerFunc = target[field];
      definition.updateHandlerDefinition(handler, { chain });
    };
  }

  function OpenApiRequest(params: OpenApiRequestDecoratorParams) {
    return (target: any, field: string): void => {
      const handler: HandlerFunc = target[field];

      const openApiRequest: Record<string, any> = { ...params };
      if (params.body instanceof ZodType) {
        openApiRequest.body = {
          contentType: 'application/json',
          schema: params.body,
        };
      }

      definition.updateHandlerDefinition(handler, { openApiRequest });
    };
  }

  function OpenApiResponse(_openApiResponse: OpenApiResponse) {
    return (target: any, field: string): void => {
      const _handler: HandlerFunc = target[field];
      // definition.updateHandlerDefinition(handler, { chain });
    };
  }

  return { definition, Handler, Chain, Controller, OpenApiRequest, OpenApiResponse };
}
