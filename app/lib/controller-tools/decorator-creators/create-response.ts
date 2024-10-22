import { Controller, ControllerPrototype, HandlerFunc } from '@/common/types/controller.types';
import {
  IControllersState,
  ResponseDef,
} from '@/lib/controller-tools/types/controllers-state.interface';
import { ZodType } from 'zod';

export function createResponse(controllersState: IControllersState) {
  /* Describe response for handler or whole controller */
  function Response(
    statusCode: number,
    contentType?: string,
    ...schemas: ZodType[]
  ): (controller: ControllerPrototype | Controller, property?: string) => void;
  function Response(
    statusCode: number,
    ...schemas: ZodType[]
  ): (controller: ControllerPrototype | Controller, property?: string) => void;
  function Response(
    statusCode: number,
    contentTypeOrSchema?: string | ZodType,
    ...schemas: ZodType[]
  ) {
    return (controller: ControllerPrototype | Controller, property?: string): void => {
      const allSchemas: ZodType[] = [];
      let contentType: string = 'application/json';

      if (contentTypeOrSchema !== undefined) {
        if (typeof contentTypeOrSchema === 'string') {
          contentType = contentTypeOrSchema;
        } else {
          allSchemas.push(contentTypeOrSchema);
        }
      }

      if (schemas) {
        allSchemas.push(...schemas);
      }

      let responses: ResponseDef[];
      if (allSchemas.length === 0) {
        responses = [
          {
            statusCode,
          },
        ];
      } else {
        responses = allSchemas.map((schema) => ({
          statusCode,
          contentType,
          schema,
        }));
      }

      if (property) {
        const handler: HandlerFunc = controller[property];
        controllersState.updateHandlerState(controller, handler, { responses });
      } else {
        controllersState.updateControllerState(controller.prototype, { responses });
      }
    };
  }

  return Response;
}
