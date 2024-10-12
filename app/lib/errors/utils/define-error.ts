import { z, ZodSchema } from 'zod';
import { AppError } from '@/lib/errors/app-error';
import { apiErrorSchema } from '@/lib/errors/schemas/api-error.schema';

export function defineError<Params = undefined>(
  name: string,
  dataSchema?: ZodSchema,
): [ErrorClass<Params>, ErrorApiSchema] {
  const errorClass = class extends AppError {
    constructor(params?: Params) {
      super(name, params ?? {});
    }
  };

  const errorApiSchema = apiErrorSchema.extend({
    statusMessage: z.literal(name),
    data: dataSchema ?? z.object({}),
  });

  return [errorClass as unknown as ErrorClass<Params>, errorApiSchema];
}

type ErrorClass<Params> = Params extends undefined
  ? new () => AppError
  : new (params: Params) => AppError;
type ErrorApiSchema = ZodSchema;
