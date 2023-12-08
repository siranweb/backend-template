import { z } from 'zod';

export const createAccountSchema = z.object({
  body: z
    .object({
      login: z.string().nonempty(),
      password: z.string().nonempty(),
    })
    .required(),
});
