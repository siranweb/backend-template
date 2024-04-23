import { Account } from '@/app/users/entities/account.entity';

export interface IUsersRepository {
  saveAccount(account: Account): Promise<Account>;
  getAccountByLogin(login: string): Promise<Account | null>;
  getAccountById(id: string): Promise<Account | null>;
  storeInvalidRefreshToken(token: string): Promise<void>;
  isRefreshTokenUsed(token: string): Promise<boolean>;
}
