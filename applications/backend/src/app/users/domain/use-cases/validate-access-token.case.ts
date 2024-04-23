import { IJWTService } from '@/app/jwt';
import { IConfig } from '@/config';
import { IValidateAccessTokenCase } from '@/app/users/domain/types';

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
