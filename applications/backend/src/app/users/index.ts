import { db } from '@/infra/database';
import { UsersController } from '@/app/users/controllers/users.controller';
import { AccountsRepository } from '@/app/users/repositories/accounts.repository';
import { RegisterAccountAction } from '@/app/users/actions/register-account.action';
import { UsersResolver } from '@/app/users/sockets/users.resolver';

export const accountsRepository = new AccountsRepository(db);
export const registerAccountAction = new RegisterAccountAction(accountsRepository);
export const usersController = new UsersController();
export const usersResolver = new UsersResolver();
