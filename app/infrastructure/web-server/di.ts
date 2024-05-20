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

export const errorHandler = new ErrorHandler();

export const usersController = new UsersController(
  config,
  createUserCase,
  refreshTokensCase,
  createTokensByCredentialsCase,
  invalidateRefreshTokenCase,
);

export const exampleController = new ExampleController();
