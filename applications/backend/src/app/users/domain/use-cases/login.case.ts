import { IUsersRepository } from '../types';
import { IJWTService } from '@/app/jwt';
import { IConfig } from '@/config';
import { UserNotFoundError } from '@/app/users/errors/user-not-found.error';
import { UserWrongPasswordError } from '@/app/users/errors/user-wrong-password.error';
import { ICryptographyService } from '@/lib/cryptography';
import { ILoginCase, TokenPair } from '@/app/users/domain/types';

export class LoginCase implements ILoginCase {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly cryptographyService: ICryptographyService,
    private readonly jwtService: IJWTService,
    private readonly config: IConfig,
  ) {}
  async execute(login: string, password: string): Promise<TokenPair> {
    const existingAccount = await this.usersRepository.getAccountByLogin(login);
    if (!existingAccount) throw new UserNotFoundError();

    const passwordHash = await this.cryptographyService.hash(password, existingAccount.salt, 1000);
    const isRightPassword = existingAccount.comparePasswordHash(passwordHash);
    if (!isRightPassword) {
      throw new UserWrongPasswordError();
    }

    const accessToken = await this.jwtService.createToken({
      payload: {
        id: existingAccount.id,
      },
      secret: this.config.jwt.secret,
      expirationTime: this.config.jwt.accessToken.expirationTime,
    });

    const refreshToken = await this.jwtService.createToken({
      payload: {
        id: existingAccount.id,
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
