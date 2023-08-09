import { Action } from '@/infra/app/types';
import { AccountsRepository } from '@/application/users/repositories/accounts.repository';
import { Account } from '@/application/users/entities/account.entity';
import { UserLoginTakenError } from '@/application/users/errors/user-login-taken.error';

interface Params {
  login: string;
  password: string;
}

export class RegisterAccountAction implements Action {
  constructor(private readonly accountsRepository: AccountsRepository) {}
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
