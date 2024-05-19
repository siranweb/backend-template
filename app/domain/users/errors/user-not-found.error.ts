import { AppError } from '@/common/errors/app-error';

export class UserNotFoundError extends AppError {
  constructor() {
    super('USER_NOT_FOUND');
  }
}
