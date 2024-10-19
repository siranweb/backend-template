import { asClass } from 'awilix';
import { Module } from '@/lib/module';
import { UsersRepository } from '@/core/users/repositories/users.repository';
import { IUsersRepository } from '@/core/users/types/users-repository.interface';
import { CreateTokensCase } from '@/core/users/cases/create-tokens.case';
import { CreateUserCase } from '@/core/users/cases/create-user.case';
import { ICreateUserCase } from '@/core/users/types/create-user-case.interface';
import { ICreateTokensCase } from '@/core/users/types/create-tokens-case.interface';
import { IRefreshTokensCase } from '@/core/users/types/refresh-tokens-case.interface';
import { IValidateTokenCase } from '@/core/users/types/validate-token.interface';
import { ICreateTokensByCredentialsCase } from '@/core/users/types/create-tokens-by-credentials-case.interface';
import { InvalidateRefreshTokenCase } from '@/core/users/cases/invalidate-refresh-token.case';
import { CreateTokensByCredentialsCase } from '@/core/users/cases/create-tokens-by-credentials.case';
import { ValidateTokenCase } from '@/core/users/cases/validate-token.case';
import { RefreshTokensCase } from '@/core/users/cases/refresh-tokens.case';
import { cryptographyModule } from '@/core/cryptography/cryptography.module';
import { jwtModule } from '@/core/jwt/jwt.module';

export const usersModule = new Module('users');
usersModule.use(cryptographyModule);
usersModule.use(jwtModule);

usersModule.register<IUsersRepository>('usersRepository', asClass(UsersRepository).singleton());
usersModule.register<ICreateTokensCase>('createTokensCase', asClass(CreateTokensCase).singleton());
usersModule.register<ICreateUserCase>('createUserCase', asClass(CreateUserCase).singleton());
usersModule.register<IRefreshTokensCase>(
  'refreshTokensCase',
  asClass(RefreshTokensCase).singleton(),
);
usersModule.register<IValidateTokenCase>(
  'validateTokenCase',
  asClass(ValidateTokenCase).singleton(),
);
usersModule.register<InvalidateRefreshTokenCase>(
  'invalidateRefreshTokenCase',
  asClass(InvalidateRefreshTokenCase).singleton(),
);
usersModule.register<ICreateTokensByCredentialsCase>(
  'createTokensByCredentialsCase',
  asClass(CreateTokensByCredentialsCase).singleton(),
);
