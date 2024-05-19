import { ErrorHandler } from '@/infrastructure/web-server/error-handlers/error-handler';
import {
  createAccountCase,
  createTokensCase,
  invalidateRefreshTokenCase,
  loginCase,
} from '@/domain/users/di';
import { UsersController } from '@/infrastructure/web-server/api/users/controller';
import { ExampleController } from '@/infrastructure/web-server/api/example/controller';
import { config } from '@/infrastructure/config';

export const errorHandler = new ErrorHandler();

export const usersController = new UsersController(
  config,
  createAccountCase,
  createTokensCase,
  loginCase,
  invalidateRefreshTokenCase,
);

export const exampleController = new ExampleController();
