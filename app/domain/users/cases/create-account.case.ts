import { Account } from '@/domain/users/entities/account.entity';
import { UserLoginTakenError } from '@/domain/users/errors/user-login-taken.error';
import { IUsersRepository } from '../types/cases.interfaces';
import { IJWTService } from '@/domain/jwt/types/jwt-service.interface';
import { IConfig } from '@/infrastructure/config';
import { ICryptographyService } from '@/domain/cryptography/types/cryptography-service.interface';
import {
  CreateAccountCaseParams,
  CreateAccountCaseResult,
  ICreateAccountCase,
} from '@/domain/users/types/cases.interfaces';

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
