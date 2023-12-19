import { AppError } from '@/infra/errors/app-error';

export class UserNotFoundError extends AppError {
  constructor() {
    super('USER_NOT_FOUND');
  }
}
