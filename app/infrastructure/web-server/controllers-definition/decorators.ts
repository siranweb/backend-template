import { HTTPMethod } from 'h3';
import {
  HandlerFunc,
  ControllerPrototype,
  Controller,
} from '@/infrastructure/web-server/types/shared';
import { IChainHandler } from '@/infrastructure/web-server/types/chain-handler.interface';
import { ZodType } from 'zod';
import type { oas31 } from 'zod-openapi/lib-types/openapi3-ts/dist';
import { appDi } from '@/infrastructure/ioc-container';
import { IControllersState } from '@/infrastructure/web-server/controllers-definition/types/controllers-state.interface';

const controllersState = appDi.resolve<IControllersState>('controllersState');

export function Handler(method: HTTPMethod, path?: string) {
  return (controller: ControllerPrototype, property: string): void => {
    const handler: HandlerFunc = controller[property];

    controllersState.setHandlerMethod(controller, handler, method);
    if (path) {
      controllersState.setHandlerPath(controller, handler, path);
    }
  };
}

export function Controller(prefix?: string) {
  return (controller: Controller): void => {
    if (prefix) {
      controllersState.setControllerPrefix(controller.prototype, prefix);
    }
  };
}

export function Chain(...chain: IChainHandler[]) {
  return (controller: ControllerPrototype | Controller, property?: string): void => {
    if (property) {
      const handler: HandlerFunc = controller[property];
      controllersState.addHandlerChain(controller, handler, chain);
    } else {
      controllersState.addControllerChain(controller.prototype, chain);
    }
  };
}

export function Body(
  contentType?: string,
  schema?: ZodType | oas31.SchemaObject,
): (controller: ControllerPrototype, property: string) => void;
export function Body(
  schema?: ZodType | oas31.SchemaObject,
): (controller: ControllerPrototype, property: string) => void;
export function Body(
  contentTypeOrSchema?: string | ZodType | oas31.SchemaObject,
  schema?: ZodType | oas31.SchemaObject,
) {
  return (controller: ControllerPrototype, property: string): void => {
    let responseSchema: ZodType | oas31.SchemaObject = {};
    let contentType: string = 'application/json';

    if (contentTypeOrSchema !== undefined) {
      if (typeof contentTypeOrSchema !== 'string') {
        responseSchema = contentTypeOrSchema;
      } else {
        responseSchema = schema ?? {};
        contentType = contentTypeOrSchema;
      }
    }

    const handler: HandlerFunc = controller[property];
    controllersState.setHandlerRequestBody(controller, handler, {
      schema: responseSchema,
      contentType,
    });
  };
}

export function Params(schema: ZodType) {
  return (controller: ControllerPrototype, property: string): void => {
    const handler: HandlerFunc = controller[property];
    controllersState.setHandlerParams(controller, handler, schema);
  };
}

export function Query(schema: ZodType) {
  return (controller: ControllerPrototype, property: string): void => {
    const handler: HandlerFunc = controller[property];
    controllersState.setHandlerQuery(controller, handler, schema);
  };
}

export function Cookie(schema: ZodType) {
  return (controller: ControllerPrototype, property: string): void => {
    const handler: HandlerFunc = controller[property];
    controllersState.setHandlerCookie(controller, handler, schema);
  };
}

export function Header(schema: ZodType) {
  return (controller: ControllerPrototype, property: string): void => {
    const handler: HandlerFunc = controller[property];
    controllersState.setHandlerHeader(controller, handler, schema);
  };
}

export function Response(
  statusCode: number,
  contentType?: string,
  schema?: ZodType | oas31.SchemaObject,
): (controller: ControllerPrototype | Controller, property?: string) => void;
export function Response(
  statusCode: number,
  schema?: ZodType | oas31.SchemaObject,
): (controller: ControllerPrototype | Controller, property?: string) => void;
export function Response(
  statusCode: number,
  contentTypeOrSchema?: string | ZodType | oas31.SchemaObject,
  schema?: ZodType | oas31.SchemaObject,
) {
  return (controller: ControllerPrototype | Controller, property?: string): void => {
    let responseSchema: ZodType | oas31.SchemaObject = {};
    let contentType: string = 'application/json';

    if (contentTypeOrSchema !== undefined) {
      if (typeof contentTypeOrSchema !== 'string') {
        responseSchema = contentTypeOrSchema;
      } else {
        responseSchema = schema ?? {};
        contentType = contentTypeOrSchema;
      }
    }

    if (property) {
      const handler: HandlerFunc = controller[property];
      controllersState.addHandlerResponse(controller, handler, {
        statusCode,
        schema: responseSchema,
        contentType,
      });
    } else {
      controllersState.addControllerResponse(controller.prototype, {
        statusCode,
        schema: responseSchema,
        contentType,
      });
    }
  };
}
