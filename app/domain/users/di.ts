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

const usersRepository = new UsersRepository(appDatabase);

export const createUserCase = new CreateUserCase(
  makeLogger(CreateUserCase.name),
  usersRepository,
  jwtService,
  cryptographyService,
  config,
);

export const refreshTokensCase = new RefreshTokensCase(
  makeLogger(RefreshTokensCase.name),
  usersRepository,
  jwtService,
  config,
);

export const createTokensByCredentialsCase = new CreateTokensByCredentialsCase(
  makeLogger(CreateTokensByCredentialsCase.name),
  usersRepository,
  cryptographyService,
  jwtService,
  config,
);

export const invalidateRefreshTokenCase = new InvalidateRefreshTokenCase(
  makeLogger(InvalidateRefreshTokenCase.name),
  usersRepository,
);

export const validateTokenCase = new ValidateTokenCase(
  makeLogger(ValidateTokenCase.name),
  jwtService,
  config,
);
