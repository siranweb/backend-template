import { IAction } from '@/infra/common/types';
import { Account } from '@/app/users/entities/account.entity';
import { UserLoginTakenError } from '@/app/users/errors/user-login-taken.error';
import { IAccountsRepository } from '@/app/users/types';

interface Params {
  login: string;
  password: string;
}

export class RegisterAccountAction implements IAction {
  constructor(private readonly accountsRepository: IAccountsRepository) {}
  async execute(params: Params): Promise<any> {
    const existingAccount = await this.accountsRepository.getAccountByLogin(params.login);
    if (existingAccount) {
      throw new UserLoginTakenError({ login: params.login });
    }

    const account = new Account({
      login: params.login,
      passwordHash: params.password,
      salt: '',
    });
    const registeredAccount = await this.accountsRepository.save(account);

    // jwt
  }
}
