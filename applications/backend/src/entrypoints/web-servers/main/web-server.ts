import { config } from '@/config';
import { WebServer } from '@/lib/web-server';
import { accountsController } from '@/di/users.di';
import { webServerAuth, webServerErrorHandler } from '@/di/entrypoints.di';

export const webServer = new WebServer({
  port: config.webServer.port,
  prefix: '/api',
});

webServer.handle('POST', '/accounts', accountsController.createAccount.bind(accountsController));
webServer.handle(
  'POST',
  '/accounts/tokens',
  accountsController.refreshTokens.bind(accountsController),
  {
    chain: [webServerAuth],
  },
);
webServer.handle('POST', '/accounts/session', accountsController.login.bind(accountsController));
webServer.handle('DELETE', '/accounts/session', accountsController.logout.bind(accountsController));

webServer.onError(webServerErrorHandler);
