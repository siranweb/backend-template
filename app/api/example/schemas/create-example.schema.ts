import { z } from 'zod';

export const createExampleSchema = z.object({
  field: z.string().openapi({
    description: 'Some field',
    example: 'Hello',
  }),
});
