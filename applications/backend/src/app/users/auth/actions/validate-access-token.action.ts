import { IAction } from '@/infra/common/types';
import { IJWTService } from '@/app/users/tokens/types';
import { Config } from '@/infra/config';

export class ValidateAccessTokenAction implements IAction {
  constructor(
    private readonly jwtService: IJWTService,
    private readonly config: Config,
  ) {}
  async execute(accessToken: string): Promise<boolean> {
    return this.jwtService.isValid({
      token: accessToken,
      secret: this.config.jwt.secret,
      issuer: this.config.jwt.issuer,
      audience: this.config.jwt.audience,
    });
  }
}
