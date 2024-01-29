import { IAction } from '@/infra/common/types';
import { IUsersRepository } from '@/app/users/shared/types';
import { IJWTService } from 'src/app/users/auth/jwt';
import { Config } from '@/config';
import { UserNotFoundError } from '@/app/users/auth/errors/user-not-found.error';
import { UserWrongPasswordError } from '@/app/users/auth/errors/user-wrong-password.error';
import { ICryptographyService } from 'src/lib/cryptography';

interface Result {
  accessToken: string;
  refreshToken: string;
}

export class LoginAction implements IAction {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly cryptographyService: ICryptographyService,
    private readonly jwtService: IJWTService,
    private readonly config: Config,
  ) {}
  async execute(login: string, password: string): Promise<Result> {
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
