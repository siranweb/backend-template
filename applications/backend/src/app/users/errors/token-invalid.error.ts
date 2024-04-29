import { AppError } from '@/app/common/errors/app-error';

export class TokenInvalidError extends AppError {
  constructor() {
    super('TOKEN_INVALID');
  }
}
