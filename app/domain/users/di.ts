import { config } from '@/infrastructure/config';
import { appDatabase } from '@/infrastructure/app-database/database';
import { UsersRepository } from '@/domain/users/repositories/users.repository';
import { CreateAccountCase } from '@/domain/users/cases/create-account.case';
import { CreateTokensByRefreshTokenCase } from '@/domain/users/cases/create-tokens-by-refresh-token.case';
import { LoginCase } from '@/domain/users/cases/login.case';
import { InvalidateRefreshTokenCase } from '@/domain/users/cases/invalidate-refresh-token.case';
import { ValidateAccessTokenCase } from '@/domain/users/cases/validate-access-token.case';
import { jwtService } from '@/domain/jwt/di';
import { cryptographyService } from '@/domain/cryptography/di';

const usersRepository = new UsersRepository(appDatabase);

export const createAccountCase = new CreateAccountCase(
  usersRepository,
  jwtService,
  cryptographyService,
  config,
);
export const createTokensCase = new CreateTokensByRefreshTokenCase(
  usersRepository,
  jwtService,
  config,
);
export const loginCase = new LoginCase(usersRepository, cryptographyService, jwtService, config);
export const invalidateRefreshTokenCase = new InvalidateRefreshTokenCase(usersRepository);
export const validateAccessTokenCase = new ValidateAccessTokenCase(jwtService, config);
