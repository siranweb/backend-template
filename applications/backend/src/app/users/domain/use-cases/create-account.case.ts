import { Account } from '@/app/users/entities/account.entity';
import { UserLoginTakenError } from '@/app/users/errors/user-login-taken.error';
import { IUsersRepository } from '../types';
import { IJWTService } from '@/app/jwt/domain/types';
import { IConfig } from 'src/app/config';
import { ICryptographyService } from '@/app/cryptography/domain/types';
import {
  CreateAccountCaseParams,
  CreateAccountCaseResult,
  ICreateAccountCase,
} from '@/app/users/domain/types';

export class CreateAccountCase implements ICreateAccountCase {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly jwtService: IJWTService,
    private readonly cryptographyService: ICryptographyService,
    private readonly config: IConfig,
  ) {}
  async execute(params: CreateAccountCaseParams): Promise<CreateAccountCaseResult> {
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
    });

    const refreshToken = await this.jwtService.createToken({
      payload: {
        id: account.id,
      },
      secret: this.config.jwt.secret,
      expirationTime: this.config.jwt.refreshToken.expirationTime,
    });

    await this.usersRepository.saveAccount(account);

    return {
      account,
      accessToken,
      refreshToken,
    };
  }
}
