import { IAction } from '@/infra/common/types';
import { IUsersRepository } from '@/app/users/shared/types';
import { IJWTService } from '@/app/users/tokens/types';
import { Config } from '@/infra/config';
import { UserNotFoundError } from '@/app/users/auth/errors/user-not-found.error';
import { TokenInvalidError } from '@/app/users/auth/errors/token-invalid.error';

interface Result {
  accessToken: string;
  refreshToken: string;
}

export class CreateTokensByRefreshTokenAction implements IAction {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly jwtService: IJWTService,
    private readonly config: Config,
  ) {}
  async execute(oldRefreshToken: string): Promise<Result> {
    const isUsed = await this.usersRepository.isRefreshTokenUsed(oldRefreshToken);
    if (isUsed) throw new TokenInvalidError();

    const { payload } = await this.jwtService.decrypt({
      token: oldRefreshToken,
      secret: this.config.jwt.secret,
      issuer: this.config.jwt.issuer,
      audience: this.config.jwt.audience,
    });
    const { accountId } = payload;

    const existingAccount = await this.usersRepository.getAccountById(accountId);
    if (!existingAccount) throw new UserNotFoundError();

    const accessToken = await this.jwtService.createToken({
      payload: {
        id: accountId,
      },
      secret: this.config.jwt.secret,
      expirationTime: this.config.jwt.accessToken.expirationTime,
      issuer: this.config.jwt.issuer,
      audience: this.config.jwt.audience,
    });

    const refreshToken = await this.jwtService.createToken({
      payload: {
        id: accountId,
      },
      secret: this.config.jwt.secret,
      expirationTime: this.config.jwt.refreshToken.expirationTime,
      issuer: this.config.jwt.issuer,
      audience: this.config.jwt.audience,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
