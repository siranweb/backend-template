import { z } from 'zod';

export const createUserSchema = z
  .object({
    login: z.string().max(40).nonempty().openapi({
      description: 'User login',
      example: 'siran',
    }),
    // TODO password regex
    password: z.string().max(40).nonempty().openapi({
      description: 'User password',
      example: 'qwerty12345',
    }),
  })
  .required();

export const loginSchema = createUserSchema;
