import { AppDatabase } from '@/databases/app-database/database';
import { Account } from '@/app/users/entities/account.entity';
import { IUsersRepository } from '../types';

export class UsersRepository implements IUsersRepository {
  constructor(private readonly db: AppDatabase) {}

  async saveAccount(account: Account): Promise<Account> {
    const result = await this.db
      .insertInto('account')
      .values(account)
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Account(result);
  }

  async getAccountByLogin(login: string): Promise<Account | null> {
    const result = await this.db
      .selectFrom('account')
      .where('login', '=', login)
      .selectAll()
      .executeTakeFirst();

    return result ? new Account(result) : null;
  }

  async getAccountById(id: string): Promise<Account | null> {
    const result = await this.db
      .selectFrom('account')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    return result ? new Account(result) : null;
  }

  async storeInvalidRefreshToken(token: string): Promise<void> {
    await this.db.insertInto('invalidRefreshToken').values({ token }).returning('token').execute();
  }

  async isRefreshTokenUsed(token: string): Promise<boolean> {
    const result = await this.db
      .selectFrom('invalidRefreshToken')
      .where('token', '=', token)
      .select('token')
      .executeTakeFirst();
    return !!result;
  }
}
