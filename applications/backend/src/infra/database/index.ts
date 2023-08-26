import { Kysely, SqliteDialect } from 'kysely';
import SQLite from 'better-sqlite3';
import { UsersTable } from './tables/users.table';
import { AccountsTable } from '@/infra/database/tables/accounts.table';

interface Database {
  users: UsersTable;
  accounts: AccountsTable;
}

const dialect = new SqliteDialect({
  database: new SQLite(':memory:'),
});

export type DB = Kysely<Database>;
export const db = new Kysely<Database>({
  dialect,
});
