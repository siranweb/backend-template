import { AppError } from '@/infra/errors/app-error';

export class TokenInvalidError extends AppError {
  constructor() {
    super('TOKEN_INVALID');
  }
}
