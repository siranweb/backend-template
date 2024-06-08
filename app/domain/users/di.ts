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
import { asClass, Resolver } from 'awilix';
import { IUsersRepository } from '@/domain/users/types/users-repository.interface';
import { appDi } from '@/infrastructure/ioc-container';
import { ICreateTokensCase } from '@/domain/users/types/create-tokens-case.interface';
import { ICreateUserCase } from '@/domain/users/types/create-user-case.interface';
import { IRefreshTokensCase } from '@/domain/users/types/refresh-tokens-case.interface';
import { ICreateTokensByCredentialsCase } from '@/domain/users/types/create-tokens-by-credentials-case.interface';
import { IValidateTokenCase } from '@/domain/users/types/validate-token.interface';

appDi.register({
  usersRepository: asClass(UsersRepository).singleton() satisfies Resolver<IUsersRepository>,
  createTokensCase: asClass(CreateTokensCase).singleton() satisfies Resolver<ICreateTokensCase>,
  createUserCase: asClass(CreateUserCase).singleton() satisfies Resolver<ICreateUserCase>,
  refreshTokensCase: asClass(RefreshTokensCase).singleton() satisfies Resolver<IRefreshTokensCase>,
  validateTokenCase: asClass(ValidateTokenCase).singleton() satisfies Resolver<IValidateTokenCase>,
  createTokensByCredentialsCase: asClass(
    CreateTokensByCredentialsCase,
  ).singleton() satisfies Resolver<ICreateTokensByCredentialsCase>,
  invalidateRefreshTokenCase: asClass(
    InvalidateRefreshTokenCase,
  ).singleton() satisfies Resolver<InvalidateRefreshTokenCase>,
});

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
