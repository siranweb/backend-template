import { config } from '@/infra/config';
import { WebServer } from '@/lib/web-server';
import { usersController } from '@/app/users';

export const webServer = new WebServer([usersController], {
  port: config.webServer.port,
  prefix: '/api',
});
