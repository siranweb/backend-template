import { z } from 'zod';

export const createAccountSchema = z.object({
  body: z
    .object({
      login: z.string().max(40).nonempty(),
      password: z.string().max(40).nonempty(),
    })
    .required(),
});
