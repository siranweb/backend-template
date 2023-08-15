import { DB } from '@/infra/database';
import { Account } from '../entities/account.entity';
import { IAccountsRepository } from '@/application/users/types';

export class AccountsRepository implements IAccountsRepository {
  constructor(private readonly db: DB) {}

  async save(account: Account): Promise<Account> {
    return await this.db.transaction().execute(async (trx) => {
      const result = await trx
        .insertInto('accounts')
        .values(account)
        .returningAll()
        .executeTakeFirstOrThrow();

      return new Account(result);
    });
  }

  async getAccountByLogin(login: string): Promise<Account | null> {
    const result = await this.db
      .selectFrom('accounts')
      .where('login', '=', login)
      .selectAll()
      .executeTakeFirst();

    return result ? new Account(result) : null;
  }
}