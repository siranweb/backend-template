import { WsServer } from '@/lib/web-sockets';
import { config } from '@/infra/config';

export const wsServer = new WsServer([], {
  port: config.webSockets.port,
});
