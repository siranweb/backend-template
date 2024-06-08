import { z } from 'zod';

export const exampleResponseSchema = z
  .object({
    hello: z.string().openapi({
      description: 'Hello field',
      example: 'world',
    }),
  })
  .openapi({
    description: 'Example',
  });
