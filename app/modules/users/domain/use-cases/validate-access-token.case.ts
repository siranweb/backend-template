import { IJWTService } from '@/modules/jwt/domain/types';
import { IConfig } from '@/modules/config';
import { IValidateAccessTokenCase } from '@/modules/users/domain/types';

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
    } catch (e) {
      return false;
    }
  }
}
