import SQLite from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import { UsersTable } from './tables/users.table';
import { AccountsTable } from '@/init/databases/app-database/tables/accounts.table';

interface Database {
  users: UsersTable;
  accounts: AccountsTable;
}

const dialect = new SqliteDialect({
  database: new SQLite(':memory:'),
});

export type AppDatabase = Kysely<Database>;
export const appDatabase = new Kysely<Database>({
  dialect,
});
