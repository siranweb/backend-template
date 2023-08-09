import { ApplicationError } from '@/infra/app/application-error';

interface Data {
  login: string;
}

export class UserLoginTakenError extends ApplicationError {
  constructor(data: Data) {
    super('LOGIN_TAKEN', data);
  }
}