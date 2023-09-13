import { Server, Socket } from 'socket.io';
import { IUsersSocketsEvents } from '@/app/users/types';

export class UsersSocketsEvents implements IUsersSocketsEvents {
  private readonly sockets: Server;

  constructor(sockets: Server) {
    this.sockets = sockets;
  }

  subscribeToAdminsRoom(socket: Socket) {
    socket.join('admins');
  }

  emitUserCreated(userId: string) {
    this.sockets.in('admins').emit('user:created', { userId });
  }
}