import { Account } from '@/app/users/entities/account.entity';
import { Socket } from 'socket.io';

export interface IAccountsRepository {
  save(account: Account): Promise<Account>;
  getAccountByLogin(login: string): Promise<Account | null>;
}

export interface IUsersSocketsEvents {
  subscribeToAdminsRoom(socket: Socket): void;
  emitUserCreated(userId: string): void;
}
