import '@/infra/common/global-imports';
import { webServer } from '@/init/web-servers/main';
// import { mainSocketsServer } from '@/init/sockets/main-sockets/sockets-server';

webServer.start()
  .then(result => console.log(`Web server (${result.prefix ?? '/'}) is listening on port ${result.port}`));
// mainSocketsServer.start();
