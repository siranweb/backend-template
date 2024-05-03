import { config } from '@/modules/config';
import { WebServer } from '@/lib/web-server';
import { usersController } from '@/di/users.di';
import { webServerErrorHandler } from '@/di/entrypoints.di';
import { registerController } from '@/modules/common/definitions/controller/register-controller';

export const mainWebServer = new WebServer({
  port: config.webServer.port,
  prefix: '/api',
});

mainWebServer.onError(webServerErrorHandler);

registerController(mainWebServer, usersController);
