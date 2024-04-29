import { config } from '@/app/config';
import { WebServer } from '@/lib/web-server';
import { accountsController } from '@/di/users.di';
import { webServerErrorHandler } from '@/di/entrypoints.di';
import { registerController } from '@/app/common/definitions/controller/register-controller';

export const mainWebServer = new WebServer({
  port: config.webServer.port,
  prefix: '/api',
});

mainWebServer.onError(webServerErrorHandler);

registerController(mainWebServer, accountsController);
