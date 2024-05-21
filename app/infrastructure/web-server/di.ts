import { ErrorHandler } from '@/infrastructure/web-server/error-handlers/error-handler';
import {
  createUserCase,
  refreshTokensCase,
  invalidateRefreshTokenCase,
  createTokensByCredentialsCase,
} from '@/domain/users/di';
import { UsersController } from '@/api/users/controller';
import { ExampleController } from '@/api/example/controller';
import { config } from '@/infrastructure/config';
import { makeLogger } from '@/infrastructure/logger/make-logger';
import { RequestLogger } from '@/infrastructure/web-server/request-logger';

export const errorHandler = new ErrorHandler();
export const requestLogger = new RequestLogger(makeLogger('webServer'));

export const usersController = new UsersController(
  config,
  createUserCase,
  refreshTokensCase,
  createTokensByCredentialsCase,
  invalidateRefreshTokenCase,
);

export const exampleController = new ExampleController();
