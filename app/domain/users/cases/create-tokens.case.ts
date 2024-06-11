import { ICreateTokensCase } from '@/domain/users/types/create-tokens-case.interface';
import { TokenPair } from '@/domain/users/types/shared';
import { IJWTService } from '@/domain/jwt/types/jwt-service.interface';
import { ILogger } from '@/infrastructure/logger/types/logger.interface';
import { IConfig } from '@/infrastructure/config/types/config.interface';

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
