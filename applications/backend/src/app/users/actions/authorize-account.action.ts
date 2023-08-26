import { IAction } from '@/infra/common/types';
import { AccountsRepository } from '@/app/users/repositories/accounts.repository';
import { Account } from '@/app/users/entities/account.entity';

interface Params {
  login: string;
  password: string;
}

export class RegisterAccountAction implements IAction {
  constructor(private readonly accountsRepository: AccountsRepository) {}
  async execute(params: Params): Promise<any> {
    const existingAccount = await this.accountsRepository.getAccountByLogin(params.login);
    if (existingAccount) {
      throw new Error(''); // already exists
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
