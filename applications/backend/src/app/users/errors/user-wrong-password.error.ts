import { AppError } from '@/app/common/errors/app-error';

export class UserWrongPasswordError extends AppError {
  constructor() {
    super('USER_WRONG_PASSWORD');
  }
}
