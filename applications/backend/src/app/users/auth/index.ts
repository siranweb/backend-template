import { config } from '@/infra/config';
import { appDatabase } from '@/init/databases/app-database/database';
import { jwtService } from '@/app/users/tokens';
import { cryptography } from '@/app/cryptography';
import { AccountsController } from '@/app/users/auth/gateway/controllers/accounts.controller';
import { AccountsRepository } from '@/app/users/auth/repositories/accounts.repository';
import { CreateAccountAction } from '@/app/users/auth/actions/create-account.action';

export const accountsRepository = new AccountsRepository(appDatabase);
export const createAccountAction = new CreateAccountAction(
  accountsRepository,
  jwtService,
  cryptography,
  config,
);
export const accountsController = new AccountsController(config, createAccountAction);
