import { IJWTService } from '@/domain/jwt/types/jwt-service.interface';
import { IConfig } from '@/infrastructure/config';
import { UserNotFoundError } from '@/domain/users/errors/user-not-found.error';
import { TokenInvalidError } from '@/domain/users/errors/token-invalid.error';
import { ILogger } from '@/infrastructure/logger/types/logger.interface';
import { IRefreshTokensCase } from '@/domain/users/types/refresh-tokens-case.interface';
import { IUsersRepository } from '@/domain/users/types/users-repository.interface';
import { TokenPair } from '@/domain/users/types/shared';

export class RefreshTokensCase implements IRefreshTokensCase {
  constructor(
    private readonly logger: ILogger,
    private readonly usersRepository: IUsersRepository,
    private readonly jwtService: IJWTService,
    private readonly config: IConfig,
  ) {}
  async execute(oldRefreshToken: string): Promise<TokenPair> {
    this.logger.info('Starting tokens refreshing.');

    const isUsed = await this.usersRepository.isRefreshTokenUsed(oldRefreshToken);
    if (isUsed) throw new TokenInvalidError();

    const userId = await this.getUserIdByRefreshToken(oldRefreshToken);
    if (!userId) throw new UserNotFoundError();

    const user = await this.usersRepository.getUserById(userId);
    if (!user) throw new UserNotFoundError();

    const tokens = await this.createTokens(userId);

    this.logger.info('Tokens were refreshed.');

    return tokens;
  }

  private async getUserIdByRefreshToken(token: string): Promise<string | null> {
    const { payload } = await this.jwtService.verify({
      token,
      secret: this.config.jwt.secret,
    });

    return payload.id ?? null;
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
