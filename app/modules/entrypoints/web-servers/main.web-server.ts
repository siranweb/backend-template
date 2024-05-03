import { config } from '@/modules/config';
import { WebServer } from '@/lib/web-server';
import { usersController } from '@/di/users.di';
import { registerController } from '@/modules/common/definitions/controller/register-controller';
import { errorHandler } from '@/di/web-server.di';

export const mainWebServer = new WebServer({
  port: config.webServer.port,
  prefix: '/api',
});

mainWebServer.onError(errorHandler);

registerController(mainWebServer, usersController);
