import { config } from 'app/infrastructure/config';
import { appDatabase } from '@/infrastructure/app-database/database';
import { JwtService } from '@/domain/jwt/services/jwt.service';
import { CryptographyService } from '@/domain/cryptography/services/cryptography.service';
import { UsersController } from '@/infrastructure/web-server/api/users/controller';
import { UsersRepository } from '@/domain/users/repositories/users.repository';
import { CreateAccountCase } from '@/domain/users/cases/create-account.case';
import { CreateTokensByRefreshTokenCase } from '@/domain/users/cases/create-tokens-by-refresh-token.case';
import { LoginCase } from '@/domain/users/cases/login.case';
import { InvalidateRefreshTokenCase } from '@/domain/users/cases/invalidate-refresh-token.case';

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

export const usersController = new UsersController(
  config,
  createAccountCase,
  createTokensCase,
  loginCase,
  invalidateRefreshTokenCase,
);
