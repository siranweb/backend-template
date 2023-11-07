import '@/infra/common/global-imports';
import { webServer } from '@/init/web-servers/main/web-server';
import { wsServer } from '@/init/web-sockets/main/ws-server';

webServer.start().then(() => console.log('Web server started'));
wsServer.start().then(() => console.log('WebSockets server started'));
