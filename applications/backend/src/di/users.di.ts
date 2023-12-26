import { config } from '@/infra/config';
import { appDatabase } from '@/init/databases/app-database/database';
import { JwtService } from '@/app/users/tokens/jwt.service';
import { CryptographyService } from '@/app/cryptography/cryptography.service';
import { AccountsController } from '@/app/users/auth/controllers/accounts.controller';
import { UsersRepository } from '@/app/users/shared/users.repository';
import { CreateAccountAction } from '@/app/users/auth/actions/create-account.action';
import { CreateTokensByRefreshTokenAction } from '@/app/users/auth/actions/create-tokens-by-refresh-token.action';
import { LoginAction } from '@/app/users/auth/actions/login.action';
import { InvalidateRefreshToken } from '@/app/users/auth/actions/invalidate-refresh-token.action';

const jwtService = new JwtService();
const cryptographyService = new CryptographyService();
const usersRepository = new UsersRepository(appDatabase);
const createAccountAction = new CreateAccountAction(
  usersRepository,
  jwtService,
  cryptographyService,
  config,
);
const createTokensAction = new CreateTokensByRefreshTokenAction(
  usersRepository,
  jwtService,
  config,
);
const loginAction = new LoginAction(usersRepository, cryptographyService, jwtService, config);
const invalidateRefreshToken = new InvalidateRefreshToken(usersRepository);

export const accountsController = new AccountsController(
  config,
  createAccountAction,
  createTokensAction,
  loginAction,
  invalidateRefreshToken,
);
