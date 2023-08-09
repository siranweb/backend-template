import { ApplicationError } from '@/infra/app/application-error';

export class UserNotFoundError extends ApplicationError {
  constructor() {
    super('USER_NOT_EXISTS');
  }
}