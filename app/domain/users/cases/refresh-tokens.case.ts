import { IJWTService } from '@/domain/jwt/types/jwt-service.interface';
import { IConfig } from '@/infrastructure/config/types/config.interface';
import { UserNotFoundError } from '@/domain/users/errors/user-not-found.error';
import { TokenInvalidError } from '@/domain/users/errors/token-invalid.error';
import { ILogger } from '@/infrastructure/logger/types/logger.interface';
import { IRefreshTokensCase } from '@/domain/users/types/refresh-tokens-case.interface';
import { IUsersRepository } from '@/domain/users/types/users-repository.interface';
import { TokenPair } from '@/domain/users/types/shared';
import { ICreateTokensCase } from '@/domain/users/types/create-tokens-case.interface';
import { IInvalidateRefreshTokenCase } from '@/domain/users/types/invalidate-refresh-token-case.interface';

export class RefreshTokensCase implements IRefreshTokensCase {
  constructor(
    private readonly logger: ILogger,
    private readonly usersRepository: IUsersRepository,
    private readonly createTokensCase: ICreateTokensCase,
    private readonly invalidateRefreshTokenCase: IInvalidateRefreshTokenCase,
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

    const tokens = await this.createTokensCase.execute(userId);

    await this.invalidateRefreshTokenCase.execute(oldRefreshToken);

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
}
