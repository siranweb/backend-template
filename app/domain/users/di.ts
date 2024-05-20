import { config } from '@/infrastructure/config';
import { appDatabase } from '@/infrastructure/app-database/database';
import { UsersRepository } from '@/domain/users/repositories/users.repository';
import { CreateUserCase } from '@/domain/users/cases/create-user.case';
import { RefreshTokensCase } from '@/domain/users/cases/refresh-tokens.case';
import { CreateTokensByCredentialsCase } from '@/domain/users/cases/create-tokens-by-credentials.case';
import { InvalidateRefreshTokenCase } from '@/domain/users/cases/invalidate-refresh-token.case';
import { ValidateTokenCase } from '@/domain/users/cases/validate-token.case';
import { jwtService } from '@/domain/jwt/di';
import { cryptographyService } from '@/domain/cryptography/di';
import { makeLogger } from '@/infrastructure/logger/make-logger';
import { CreateTokensCase } from '@/domain/users/cases/create-tokens.case';

const usersRepository = new UsersRepository(appDatabase);

const createTokensCase = new CreateTokensCase(
  makeLogger(CreateTokensCase.name),
  config,
  jwtService,
);

export const invalidateRefreshTokenCase = new InvalidateRefreshTokenCase(
  makeLogger(InvalidateRefreshTokenCase.name),
  usersRepository,
);

export const createUserCase = new CreateUserCase(
  makeLogger(CreateUserCase.name),
  usersRepository,
  createTokensCase,
  cryptographyService,
);

export const refreshTokensCase = new RefreshTokensCase(
  makeLogger(RefreshTokensCase.name),
  usersRepository,
  createTokensCase,
  invalidateRefreshTokenCase,
  jwtService,
  config,
);

export const createTokensByCredentialsCase = new CreateTokensByCredentialsCase(
  makeLogger(CreateTokensByCredentialsCase.name),
  usersRepository,
  cryptographyService,
  createTokensCase,
);

export const validateTokenCase = new ValidateTokenCase(
  makeLogger(ValidateTokenCase.name),
  jwtService,
  config,
);
