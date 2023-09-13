import '@/infra/common/global-imports';
import { mainWebServer } from '@/init/web-servers/main-web-server/web-server';
import { mainSocketsServer } from '@/init/sockets/main-sockets/sockets-server';

mainWebServer.start();
mainSocketsServer.start();
