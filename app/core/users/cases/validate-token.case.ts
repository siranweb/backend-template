import { IJWTService } from '@/core/jwt/types/jwt-service.interface';
import { IConfig } from '@/infrastructure/shared/types/config.interface';
import { ILogger } from '@/lib/logger/types/logger.interface';
import { IValidateTokenCase } from '@/core/users/types/validate-token.interface';

export class ValidateTokenCase implements IValidateTokenCase {
  constructor(
    private readonly logger: ILogger,
    private readonly jwtService: IJWTService,
    private readonly config: IConfig,
  ) {}

  async execute(token: string): Promise<boolean> {
    this.logger.info('Starting token validation.');

    const result = await this.validateToken(token);

    this.logger.info('Token was validated.', { result });

    return result;
  }

  private async validateToken(token: string): Promise<boolean> {
    try {
      await this.jwtService.verify({
        token,
        secret: this.config.jwt.secret,
      });
      return true;
    } catch {
      return false;
    }
  }
}
