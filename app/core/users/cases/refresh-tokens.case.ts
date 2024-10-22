import { IJWTService } from '@/core/jwt/types/jwt-service.interface';
import { IConfig } from '@/infrastructure/shared/types/config.interface';
import { ILogger } from '@/lib/logger/types/logger.interface';
import { IRefreshTokensCase } from '@/core/users/types/refresh-tokens-case.interface';
import { IUsersRepository } from '@/core/users/types/users-repository.interface';
import { ICreateTokensCase } from '@/core/users/types/create-tokens-case.interface';
import { IInvalidateRefreshTokenCase } from '@/core/users/types/invalidate-refresh-token-case.interface';
import { TokenPair } from '@/core/users/types/shared';
import { TokenInvalidError } from '@/core/users/errors/token-invalid.error';
import { UserNotFoundError } from '@/core/users/errors/user-not-found.error';
import { inject } from 'di-wise';
import { usersModuleTokens } from '../users.module';
import { jwtModuleTokens } from '@/core/jwt/jwt.module';
import { injectLogger, sharedModuleTokens } from '@/infrastructure/shared/shared.module';

export class RefreshTokensCase implements IRefreshTokensCase {
  constructor(
    private readonly logger: ILogger = injectLogger(RefreshTokensCase.name),
    private readonly usersRepository: IUsersRepository = inject(usersModuleTokens.usersRepository),
    private readonly createTokensCase: ICreateTokensCase = inject(
      usersModuleTokens.createTokensCase,
    ),
    private readonly invalidateRefreshTokenCase: IInvalidateRefreshTokenCase = inject(
      usersModuleTokens.invalidateRefreshTokenCase,
    ),
    private readonly jwtService: IJWTService = inject(jwtModuleTokens.jwtService),
    private readonly config: IConfig = inject(sharedModuleTokens.config),
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
