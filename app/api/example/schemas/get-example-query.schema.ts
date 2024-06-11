import { z } from 'zod';

export const getExampleQuerySchema = z.object({
  field: z.string().openapi({
    description: 'Some field',
    example: 'Hello',
  }),
});
