import { IJWTService } from '@/core/jwt/types/jwt-service.interface';
import { ILogger } from '@/lib/logger/types/logger.interface';
import { IConfig } from '@/infrastructure/shared/types/config.interface';
import { TokenPair } from '@/core/users/types/shared';
import { ICreateTokensCase } from '@/core/users/types/create-tokens-case.interface';
import { jwtModuleTokens } from '@/core/jwt/jwt.module';
import { inject } from 'di-wise';
import { injectLogger, sharedModuleTokens } from '@/infrastructure/shared/shared.module';

export class CreateTokensCase implements ICreateTokensCase {
  constructor(
    private readonly logger: ILogger = injectLogger(CreateTokensCase.name),
    private readonly config: IConfig = inject(sharedModuleTokens.config),
    private readonly jwtService: IJWTService = inject(jwtModuleTokens.jwtService),
  ) {}

  async execute(userId: string): Promise<TokenPair> {
    this.logger.info('Starting tokens creating.', { userId });

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

    this.logger.info('Tokens were created.', { userId });

    return {
      accessToken,
      refreshToken,
    };
  }
}
