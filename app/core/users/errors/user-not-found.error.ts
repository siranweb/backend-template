import { defineError } from '@/lib/errors/utils/define-error';

export const [UserNotFoundError, userNotFoundApiErrorSchema] = defineError('USER_NOT_FOUND');
