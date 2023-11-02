import { config } from '@/infra/config';
import { errorHandler } from '@/infra/web-server/error-handler';
import { WebServer } from '@/lib/web-server';
import { usersController } from '@/app/users';

export const webServer = new WebServer([usersController], {
  port: config.webServer.port,
  prefix: '/api',
});

webServer.onError(errorHandler());
