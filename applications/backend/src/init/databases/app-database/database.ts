import { Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';
import { config } from '@/infra/config';
import { UsersTable } from './tables/users.table';
import { AccountsTable } from './tables/accounts.table';

interface Database {
  users: UsersTable;
  accounts: AccountsTable;
}

const dialect = new PostgresDialect({
  pool: new pg.Pool({
    database: config.database.primary.db,
    user: config.database.primary.user,
    password: config.database.primary.password,
    host: config.database.primary.host,
    port: config.database.primary.port,
    max: 10,
  }),
});

export type AppDatabase = Kysely<Database>;
export const appDatabase = new Kysely<Database>({
  dialect,
});
