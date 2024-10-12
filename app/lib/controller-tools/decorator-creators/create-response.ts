import { Controller, ControllerPrototype, HandlerFunc } from '@/common/types/controller.types';
import { IControllersState } from '@/lib/controller-tools/types/controllers-state.interface';
import { ZodType } from 'zod';
import type { oas31 } from 'zod-openapi/lib-types/openapi3-ts/dist';

export function createResponse(controllersState: IControllersState) {
  function Response(
    statusCode: number,
    contentType?: string,
    schema?: ZodType | oas31.SchemaObject,
  ): (controller: ControllerPrototype | Controller, property?: string) => void;
  function Response(
    statusCode: number,
    schema?: ZodType | oas31.SchemaObject,
  ): (controller: ControllerPrototype | Controller, property?: string) => void;
  function Response(
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

  return Response;
}
