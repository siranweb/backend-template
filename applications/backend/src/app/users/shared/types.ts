import { Account } from '@/app/users/auth/entities/account.entity';

export interface IUsersRepository {
  save(account: Account): Promise<Account>;
  getAccountByLogin(login: string): Promise<Account | null>;
  getAccountById(id: string): Promise<Account | null>;
}
