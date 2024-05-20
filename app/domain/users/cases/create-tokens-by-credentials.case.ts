import { IJWTService } from '@/domain/jwt/types/jwt-service.interface';
import { IConfig } from '@/infrastructure/config';
import { UserNotFoundError } from '@/domain/users/errors/user-not-found.error';
import { UserWrongPasswordError } from '@/domain/users/errors/user-wrong-password.error';
import { ICryptographyService } from '@/domain/cryptography/types/cryptography-service.interface';
import { ILogger } from '@/infrastructure/logger/types/logger.interface';
import { ICreateTokensByCredentialsCase } from '@/domain/users/types/create-tokens-by-credentials-case.interface';
import { IUsersRepository } from '@/domain/users/types/users-repository.interface';
import { TokenPair, UserCredentials } from '@/domain/users/types/shared';

export class CreateTokensByCredentialsCase implements ICreateTokensByCredentialsCase {
  constructor(
    private readonly logger: ILogger,
    private readonly usersRepository: IUsersRepository,
    private readonly cryptographyService: ICryptographyService,
    private readonly jwtService: IJWTService,
    private readonly config: IConfig,
  ) {}
  async execute(credentials: UserCredentials): Promise<TokenPair> {
    const { login, password } = credentials;
    this.logger.info('Starting tokens creating by user credentials', { login });

    const user = await this.usersRepository.getUserByLogin(login);
    if (!user) {
      throw new UserNotFoundError();
    }

    const passwordHash = await this.cryptographyService.hash(password, user.salt, 1000);
    const isRightPassword = user.isCorrectPasswordHash(passwordHash);
    if (!isRightPassword) {
      throw new UserWrongPasswordError();
    }

    const tokens = await this.createTokens(user.id);

    this.logger.info('Tokens were created by user credentials.', { user });

    return tokens;
  }

  private async createTokens(userId: string): Promise<TokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.createToken({
        payload: {
          id: userId,
        },
        secret: this.config.jwt.secret,
        expirationTime: this.config.jwt.accessToken.expirationTime,
      }),
      await this.jwtService.createToken({
        payload: {
          id: userId,
        },
        secret: this.config.jwt.secret,
        expirationTime: this.config.jwt.refreshToken.expirationTime,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
