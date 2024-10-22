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
import { sharedModule } from '@/infrastructure/shared/shared.module';
import { Type } from 'di-wise';

export const usersModule = new Module('users');
usersModule.import(sharedModule);
usersModule.import(cryptographyModule);
usersModule.import(jwtModule);

export const usersModuleTokens = {
  usersRepository: Type<IUsersRepository>('usersRepository'),
  createTokensCase: Type<ICreateTokensCase>('createTokensCase'),
  createUserCase: Type<ICreateUserCase>('createUserCase'),
  refreshTokensCase: Type<IRefreshTokensCase>('refreshTokensCase'),
  validateTokenCase: Type<IValidateTokenCase>('validateTokenCase'),
  invalidateRefreshTokenCase: Type<InvalidateRefreshTokenCase>('invalidateRefreshTokenCase'),
  createTokensByCredentialsCase: Type<ICreateTokensByCredentialsCase>(
    'createTokensByCredentialsCase',
  ),
};

usersModule.register(
  usersModuleTokens.usersRepository,
  { useClass: UsersRepository },
  { private: true },
);

usersModule.register(usersModuleTokens.createTokensCase, { useClass: CreateTokensCase });
usersModule.register(usersModuleTokens.createUserCase, { useClass: CreateUserCase });
usersModule.register(usersModuleTokens.refreshTokensCase, { useClass: RefreshTokensCase });
usersModule.register(usersModuleTokens.validateTokenCase, { useClass: ValidateTokenCase });
usersModule.register(usersModuleTokens.invalidateRefreshTokenCase, {
  useClass: InvalidateRefreshTokenCase,
});
usersModule.register(usersModuleTokens.createTokensByCredentialsCase, {
  useClass: CreateTokensByCredentialsCase,
});
