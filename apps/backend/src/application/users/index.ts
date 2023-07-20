import { UsersController } from './controllers/users.controller';
import { AccountsRepository } from './repositories/accounts.repository';
import { RegisterAccountAction } from '@/application/users/actions/register-account.action';
import { db } from '@/infra/database';

export const accountsRepository = new AccountsRepository(db);
export const registerAccountAction = new RegisterAccountAction(accountsRepository);
export const usersController = new UsersController();
