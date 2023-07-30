import { EventHandler, SocketEventsResolver, SocketMiddlewares } from '@/infra/sockets/decorators';
import { Socket } from 'socket.io';
import { SocketMiddleware } from '@/infra/sockets';

const middlewareExample: SocketMiddleware = async (socket, next) => {
  console.log(1);
  await next();
}

@SocketEventsResolver()
export class UsersResolver {
  @SocketMiddlewares(middlewareExample)
  @EventHandler('user:updateList')
  async handleUpdateList(socket: Socket) {
    console.log('event!');
  }
}