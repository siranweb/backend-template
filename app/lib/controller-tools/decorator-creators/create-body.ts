import { ControllerPrototype, HandlerFunc } from '@/common/types/controller.types';
import { IControllersState } from '@/lib/controller-tools/types/controllers-state.interface';
import { ZodType } from 'zod';
import type { oas31 } from 'zod-openapi/lib-types/openapi3-ts/dist';

export function createBody(controllersState: IControllersState) {
  function Body(
    contentType?: string,
    schema?: ZodType | oas31.SchemaObject,
  ): (controller: ControllerPrototype, property: string) => void;
  function Body(
    schema?: ZodType | oas31.SchemaObject,
  ): (controller: ControllerPrototype, property: string) => void;
  function Body(
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

  return Body;
}
