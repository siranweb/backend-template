import { Account } from '@/application/users/entities/account.entity';

export interface IAccountsRepository {
  save(account: Account): Promise<Account>;
  getAccountByLogin(login: string): Promise<Account | null>;
}