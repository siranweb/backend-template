import { z } from 'zod';

export const getExampleByIdParamsSchema = z.object({
  id: z.string().openapi({
    description: 'Some field',
    example: '123',
  }),
});
