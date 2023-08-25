import { AppError } from '@/lib/errors/app-error';

export class UserNotFoundError extends AppError {
  constructor() {
    super('USER_NOT_EXISTS');
  }
}