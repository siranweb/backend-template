import { IJWTService } from '@/domain/jwt/types/jwt-service.interface';
import { IConfig } from '@/infrastructure/config';
import { IValidateAccessTokenCase } from '@/domain/users/types/cases.interfaces';

export class ValidateAccessTokenCase implements IValidateAccessTokenCase {
  constructor(
    private readonly jwtService: IJWTService,
    private readonly config: IConfig,
  ) {}
  async execute(accessToken: string): Promise<boolean> {
    try {
      await this.jwtService.verify({
        token: accessToken,
        secret: this.config.jwt.secret,
      });
      return true;
    } catch {
      return false;
    }
  }
}
