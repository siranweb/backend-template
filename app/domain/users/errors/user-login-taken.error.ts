import { AppError } from '@/common/errors/app-error';

interface Data {
  login: string;
}

export class UserLoginTakenError extends AppError {
  constructor(data: Data) {
    super('LOGIN_TAKEN', data);
  }
}
