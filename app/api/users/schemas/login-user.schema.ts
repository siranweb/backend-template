import { z } from 'zod';

export const loginUserSchema = z
  .object({
    login: z.string().max(40).nonempty(),
    password: z.string().max(40).nonempty(),
  })
  .required();
