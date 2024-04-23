import { WsServer } from '@/lib/web-sockets';
import { config } from '@/config';

export const mainWsServer = new WsServer({
  port: config.webSockets.port,
});
