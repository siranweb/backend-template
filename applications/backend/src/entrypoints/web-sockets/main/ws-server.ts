import { WsServer } from '@/lib/web-sockets';
import { config } from '@/config';

export const wsServer = new WsServer([], {
  port: config.webSockets.port,
});
