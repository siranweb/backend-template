import { appDatabase } from '@/init/databases/app-database/database';
import { UsersController } from '@/app/users/controllers/users.controller';
import { AccountsRepository } from '@/app/users/repositories/accounts.repository';
import { RegisterAccountAction } from '@/app/users/actions/register-account.action';

export const accountsRepository = new AccountsRepository(appDatabase);
export const registerAccountAction = new RegisterAccountAction(accountsRepository);
export const usersController = new UsersController();
