import { SocketsServer } from '@/lib/legacy-sockets/sockets-server';
import { config } from '@/infra/config';
import { usersResolver } from '@/app/users';
import { mainSockets } from '@/init/sockets/main-sockets/sockets';

export const mainSocketsServer = new SocketsServer(mainSockets, config, [usersResolver]);
