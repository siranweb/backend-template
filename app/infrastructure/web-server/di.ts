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
import { createRouter } from 'h3';
import { ControllerInitializer } from '@/infrastructure/web-server/controllers-definition/controller-initializer';
import { controllersState } from '@/infrastructure/web-server/controllers-definition/controllers-state';

const webServerLogger = makeLogger('webServer');
export const requestLogger = new RequestLogger(webServerLogger);
export const apiRouter = createRouter();

export const apiControllerInitializer = new ControllerInitializer(
  webServerLogger,
  controllersState,
  apiRouter,
);

export const usersController = new UsersController(
  config,
  createUserCase,
  refreshTokensCase,
  createTokensByCredentialsCase,
  invalidateRefreshTokenCase,
);

export const exampleController = new ExampleController();
