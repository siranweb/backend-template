import { IJWTService } from '@/core/jwt/types/jwt-service.interface';
import { ILogger } from '@/lib/logger/types/logger.interface';
import { IConfig } from '@/infrastructure/shared/types/config.interface';
import { TokenPair } from '@/core/users/types/shared';
import { ICreateTokensCase } from '@/core/users/types/create-tokens-case.interface';

export class CreateTokensCase implements ICreateTokensCase {
  constructor(
    private readonly logger: ILogger,
    private readonly config: IConfig,
    private readonly jwtService: IJWTService,
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
