import { EventHandler, SocketEventsResolver } from '@/infra/sockets/decorators';
import { Socket } from 'socket.io';

@SocketEventsResolver('users')
export class UsersResolver {
  @EventHandler('user:updateList')
  async handleUpdateList(socket: Socket) {

  }
}