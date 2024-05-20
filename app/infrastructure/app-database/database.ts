import pg from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { config } from 'app/infrastructure/config';
import { UserTable } from '@/infrastructure/app-database/tables/user.table';
import { InvalidRefreshTokenTable } from '@/infrastructure/app-database/tables/invalid-refresh-token.table';

interface Database {
  user: UserTable;
  invalid_refresh_token: InvalidRefreshTokenTable;
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
