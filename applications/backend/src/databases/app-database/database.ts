import { Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';
import { config } from '@/config';
import { AccountTable } from './tables/account.table';
import { InvalidRefreshTokenTable } from './tables/invalid-refresh-token.table';

interface Database {
  account: AccountTable;
  invalidRefreshToken: InvalidRefreshTokenTable;
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