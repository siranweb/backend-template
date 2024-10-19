import { z } from 'zod';

export const apiErrorSchema = z
  .object({
    statusCode: z.number(),
    statusMessage: z.string(),
    data: z.object({}),
  })
  .required();
