import { ChainFunc, HandlerFunc, IChainHandler } from '@/lib/web-server';
import { ControllerDefinition } from '../../definitions/controller/controller-definition';
import {
  IControllerDefinition,
  OpenApiResult,
  OpenApiRoute,
} from '@/modules/common/types/controller-definition.interface';

export function createControllerDefinition() {
  const definition: IControllerDefinition = new ControllerDefinition();

  function Handler(method: string, path?: string) {
    return (target: any, field: string): void => {
      const handler: HandlerFunc = target[field];
      definition.updateHandlerDefinition(handler, { method, path });
    };
  }

  function Chain(...chain: (ChainFunc | IChainHandler)[]) {
    return (target: any, field: string): void => {
      const handler: HandlerFunc = target[field];
      definition.updateHandlerDefinition(handler, { chain });
    };
  }

  function Controller(prefix?: string) {
    return (_target: any): void => {
      definition.updateControllerDefinition({ prefix });
    };
  }

  function OpenApiRoute(_openApiRoute: OpenApiRoute) {
    return (target: any, field: string): void => {
      const _handler: HandlerFunc = target[field];
      // definition.updateHandlerDefinition(handler, { chain });
    };
  }

  function OpenApiResult(_openApiResult: OpenApiResult) {
    return (target: any, field: string): void => {
      const _handler: HandlerFunc = target[field];
      // definition.updateHandlerDefinition(handler, { chain });
    };
  }

  return { definition, Handler, Chain, Controller, OpenApiRoute, OpenApiResult };
}
