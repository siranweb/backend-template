import { Account } from '@/app/users/auth/entities/account.entity';

export interface IAccountsRepository {
  save(account: Account): Promise<Account>;
  getAccountByLogin(login: string): Promise<Account | null>;
}
