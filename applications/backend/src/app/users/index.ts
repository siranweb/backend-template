import { UsersController } from './controllers/users.controller';
import { AccountsRepository } from './repositories/accounts.repository';
import { RegisterAccountAction } from '@/app/users/actions/register-account.action';
import { db } from '@/lib/database';
import { UsersResolver } from '@/app/users/sockets/users.resolver';

export const accountsRepository = new AccountsRepository(db);
export const registerAccountAction = new RegisterAccountAction(accountsRepository);
export const usersController = new UsersController();
export const usersResolver = new UsersResolver();
