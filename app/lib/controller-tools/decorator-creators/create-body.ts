import { ControllerPrototype, HandlerFunc } from '@/common/types/controller.types';
import {
  BodyDef,
  IControllersState,
} from '@/lib/controller-tools/types/controllers-state.interface';
import { ZodType } from 'zod';

export function createBody(controllersState: IControllersState) {
  /* Describe body for handler */
  function Body(
    contentType?: string,
    ...schemas: ZodType[]
  ): (controller: ControllerPrototype, property: string) => void;
  function Body(...schemas: ZodType[]): (controller: ControllerPrototype, property: string) => void;
  function Body(contentTypeOrSchema?: string | ZodType, ...schemas: ZodType[]) {
    return (controller: ControllerPrototype, property: string): void => {
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

      let bodies: BodyDef[];
      if (allSchemas.length === 0) {
        bodies = [
          {
            contentType,
          },
        ];
      } else {
        bodies = allSchemas.map((schema) => ({
          contentType,
          schema,
        }));
      }

      const handler: HandlerFunc = controller[property];
      controllersState.updateHandlerState(controller, handler, { bodies });
    };
  }

  return Body;
}
