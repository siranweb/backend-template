import { IUsersRepository } from '../types';
import { IJWTService } from '@/app/jwt/domain/types';
import { IConfig } from 'src/app/config';
import { UserNotFoundError } from '@/app/users/errors/user-not-found.error';
import { TokenInvalidError } from '@/app/users/errors/token-invalid.error';
import { ICreateTokensByRefreshTokenCase, TokenPair } from '@/app/users/domain/types';

export class CreateTokensByRefreshTokenCase implements ICreateTokensByRefreshTokenCase {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly jwtService: IJWTService,
    private readonly config: IConfig,
  ) {}
  async execute(oldRefreshToken: string): Promise<TokenPair> {
    const isUsed = await this.usersRepository.isRefreshTokenUsed(oldRefreshToken);
    if (isUsed) throw new TokenInvalidError();

    const { payload } = await this.jwtService.verify({
      token: oldRefreshToken,
      secret: this.config.jwt.secret,
    });

    const { id: accountId } = payload;
    if (typeof accountId !== 'string') throw new UserNotFoundError();

    const existingAccount = await this.usersRepository.getAccountById(accountId);
    if (!existingAccount) throw new UserNotFoundError();

    const accessToken = await this.jwtService.createToken({
      payload: {
        id: accountId,
      },
      secret: this.config.jwt.secret,
      expirationTime: this.config.jwt.accessToken.expirationTime,
    });

    const refreshToken = await this.jwtService.createToken({
      payload: {
        id: accountId,
      },
      secret: this.config.jwt.secret,
      expirationTime: this.config.jwt.refreshToken.expirationTime,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
