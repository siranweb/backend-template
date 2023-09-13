import { appDatabase } from '@/init/databases/app-database/database';
import { mainSockets } from '@/init/sockets/main-sockets/sockets';
import { UsersController } from '@/app/users/controllers/users.controller';
import { AccountsRepository } from '@/app/users/repositories/accounts.repository';
import { RegisterAccountAction } from '@/app/users/actions/register-account.action';
import { UsersResolver } from '@/app/users/sockets-resolvers/users.resolver';
import { UsersSocketsEvents } from '@/app/users/sockets-events/users.events';

export const usersSocketsEvents = new UsersSocketsEvents(mainSockets);
export const accountsRepository = new AccountsRepository(appDatabase);
export const registerAccountAction = new RegisterAccountAction(accountsRepository);
export const usersController = new UsersController();
export const usersResolver = new UsersResolver();
