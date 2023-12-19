import { config } from '@/infra/config';
import { appDatabase } from '@/init/databases/app-database/database';
import { jwtService } from '@/app/users/tokens';
import { cryptography } from '@/app/cryptography';
import { AccountsController } from '@/app/users/auth/gateway/controllers/accounts.controller';
import { UsersRepository } from '@/app/users/shared/users.repository';
import { CreateAccountAction } from '@/app/users/auth/actions/create-account.action';
import { CreateTokensByRefreshTokenAction } from '@/app/users/auth/actions/create-tokens-by-refresh-token.action';
import { LoginAction } from '@/app/users/auth/actions/login.action';
import { InvalidateRefreshToken } from '@/app/users/auth/actions/invalidate-refresh-token.action';

export const usersRepository = new UsersRepository(appDatabase);
export const createAccountAction = new CreateAccountAction(
  usersRepository,
  jwtService,
  cryptography,
  config,
);
export const createTokensAction = new CreateTokensByRefreshTokenAction(
  usersRepository,
  jwtService,
  config,
);
export const loginAction = new LoginAction(usersRepository, cryptography, jwtService, config);
export const invalidateRefreshToken = new InvalidateRefreshToken(usersRepository);
export const accountsController = new AccountsController(
  config,
  createAccountAction,
  createTokensAction,
  loginAction,
  invalidateRefreshToken,
);
