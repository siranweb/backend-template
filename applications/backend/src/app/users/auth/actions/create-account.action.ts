import { IAction } from '@/infra/common/types';
import { Account } from '@/app/users/auth/entities/account.entity';
import { UserLoginTakenError } from '@/app/users/auth/errors/user-login-taken.error';
import { IUsersRepository } from '@/app/users/shared/types';
import { IJWTService } from 'src/app/users/auth/jwt';
import { Config } from '@/config';
import { ICryptographyService } from 'src/lib/cryptography';

interface Params {
  login: string;
  password: string;
}

interface Result {
  account: Account;
  accessToken: string;
  refreshToken: string;
}

export class CreateAccountAction implements IAction {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly jwtService: IJWTService,
    private readonly cryptographyService: ICryptographyService,
    private readonly config: Config,
  ) {}
  async execute(params: Params): Promise<Result> {
    const existingAccount = await this.usersRepository.getAccountByLogin(params.login);
    if (existingAccount) {
      throw new UserLoginTakenError({ login: params.login });
    }

    const salt = this.cryptographyService.random(20);
    const passwordHash = await this.cryptographyService.hash(params.password, salt, 1000);

    const account = new Account({
      login: params.login,
      passwordHash,
      salt,
    });

    const accessToken = await this.jwtService.createToken({
      payload: {
        id: account.id,
      },
      secret: this.config.jwt.secret,
      expirationTime: this.config.jwt.accessToken.expirationTime,
      issuer: this.config.jwt.issuer,
      audience: this.config.jwt.audience,
    });

    const refreshToken = await this.jwtService.createToken({
      payload: {
        id: account.id,
      },
      secret: this.config.jwt.secret,
      expirationTime: this.config.jwt.refreshToken.expirationTime,
      issuer: this.config.jwt.issuer,
      audience: this.config.jwt.audience,
    });

    await this.usersRepository.saveAccount(account);

    return {
      account,
      accessToken,
      refreshToken,
    };
  }
}
