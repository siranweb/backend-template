import { config } from '@/config';
import { appDatabase } from '@/databases/app-database/database';
import { JwtService } from '@/app/jwt/domain/services/jwt.service';
import { CryptographyService } from '@/lib/cryptography';
import { AccountsController } from '@/app/users/api/accounts/accounts.controller';
import { UsersRepository } from '@/app/users/repositories/users.repository';
import { CreateAccountCase } from '@/app/users/domain/use-cases/create-account.case';
import { CreateTokensByRefreshTokenCase } from '@/app/users/domain/use-cases/create-tokens-by-refresh-token.case';
import { LoginCase } from '@/app/users/domain/use-cases/login.case';
import { InvalidateRefreshTokenCase } from '@/app/users/domain/use-cases/invalidate-refresh-token.case';

const jwtService = new JwtService();
const cryptographyService = new CryptographyService();
const usersRepository = new UsersRepository(appDatabase);
const createAccountCase = new CreateAccountCase(
  usersRepository,
  jwtService,
  cryptographyService,
  config,
);
const createTokensCase = new CreateTokensByRefreshTokenCase(usersRepository, jwtService, config);
const loginCase = new LoginCase(usersRepository, cryptographyService, jwtService, config);
const invalidateRefreshTokenCase = new InvalidateRefreshTokenCase(usersRepository);

export const accountsController = new AccountsController(
  config,
  createAccountCase,
  createTokensCase,
  loginCase,
  invalidateRefreshTokenCase,
);
