import { AppDatabase } from '@/init/databases/app-database/database';
import { Account } from '../../auth/entities/account.entity';
import { IUsersRepository } from '@/app/users/shared/types';

export class UsersRepository implements IUsersRepository {
  constructor(private readonly db: AppDatabase) {}

  async save(account: Account): Promise<Account> {
    return await this.db.transaction().execute(async (trx): Promise<Account> => {
      const result = await trx
        .insertInto('account')
        .values(account)
        .returningAll()
        .executeTakeFirstOrThrow();

      return new Account(result);
    });
  }

  async getAccountByLogin(login: string): Promise<Account | null> {
    const result = await this.db
      .selectFrom('account')
      .where('login', '=', login)
      .selectAll()
      .executeTakeFirst();

    return result ? new Account(result) : null;
  }
}
