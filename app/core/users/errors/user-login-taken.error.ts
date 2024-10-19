import { defineError } from '@/lib/errors/utils/define-error';
import { z } from 'zod';

export const [UserLoginTakenError, userLoginTakenApiErrorSchema] = defineError<{
  login: string;
}>(
  'LOGIN_TAKEN',
  z.object({
    login: z.string(),
  }),
);
