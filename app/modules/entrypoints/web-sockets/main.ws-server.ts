import { WsServer } from '@/lib/web-sockets';
import { config } from '@/modules/config';

export const mainWsServer = new WsServer({
  port: config.webSockets.port,
});
