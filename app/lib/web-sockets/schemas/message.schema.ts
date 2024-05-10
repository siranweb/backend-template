import { z } from 'zod';

export const messageSchema = z.object({
  event: z.string(),
  data: z.object({}),
});
