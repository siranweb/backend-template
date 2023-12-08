import { IAction } from '@/infra/common/types';
import { Account } from '@/app/users/auth/entities/account.entity';
import { UserLoginTakenError } from '@/app/users/auth/errors/user-login-taken.error';
import { IAccountsRepository } from '@/app/users/auth/types';
import { IJWTService } from '@/app/users/tokens/types';
import { Config } from '@/infra/config';
import { ICryptography } from '@/app/cryptography/types';

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
    private readonly accountsRepository: IAccountsRepository,
    private readonly jwtService: IJWTService,
    private readonly cryptography: ICryptography,
    private readonly config: Config,
  ) {}
  async execute(params: Params): Promise<Result> {
    const existingAccount = await this.accountsRepository.getAccountByLogin(params.login);
    if (existingAccount) {
      throw new UserLoginTakenError({ login: params.login });
    }

    const salt = this.cryptography.random(20);
    const passwordHash = await this.cryptography.hash(params.password, salt, 1000);

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

    await this.accountsRepository.save(account);

    return {
      account,
      accessToken,
      refreshToken,
    };
  }
}
