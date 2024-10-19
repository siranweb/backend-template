import { defineError } from '@/lib/errors/utils/define-error';

export const [UserWrongPasswordError, userWrongPasswordApiErrorSchema] =
  defineError('USER_WRONG_PASSWORD');
