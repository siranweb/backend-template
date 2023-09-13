import { EventHandler, SocketsResolver, SocketsMiddlewares } from '@/lib/sockets/decorators';
import { Socket } from 'socket.io';
import { SocketMiddleware } from '@/lib/sockets/types';

const middlewareExample: SocketMiddleware = async (socket, next) => {
  console.log(1);
  await next();
};

@SocketsResolver()
export class UsersResolver {
  @SocketsMiddlewares(middlewareExample)
  @EventHandler('user:updateList')
  async handleUpdateList(socket: Socket) {
    console.log('event!', socket);
  }
}
