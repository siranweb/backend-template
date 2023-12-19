import { Account } from '@/app/users/auth/entities/account.entity';

export interface IUsersRepository {
  saveAccount(account: Account): Promise<Account>;
  getAccountByLogin(login: string): Promise<Account | null>;
  getAccountById(id: string): Promise<Account | null>;
  storeInvalidRefreshToken(token: string): Promise<string>;
  isRefreshTokenUsed(token: string): Promise<boolean>;
}
