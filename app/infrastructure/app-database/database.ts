import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { UserTable } from '@/infrastructure/app-database/tables/user.table';
import { InvalidRefreshTokenTable } from '@/infrastructure/app-database/tables/invalid-refresh-token.table';
import pg from 'pg';
import { config } from '@/infrastructure/config';
import { UpdatedAtPlugin } from '@/infrastructure/app-database/plugins/updated-at.plugin';

interface Database {
  user: UserTable;
  invalidRefreshToken: InvalidRefreshTokenTable;
}
export type IAppDatabase = Kysely<Database>;

export const appDatabase = makeAppDatabase();

export function makeAppDatabase(): IAppDatabase {
  return new Kysely({
    dialect: new PostgresDialect({
      pool: new pg.Pool({
        database: config.database.primary.db,
        user: config.database.primary.user,
        password: config.database.primary.password,
        host: config.database.primary.host,
        port: config.database.primary.port,
        max: 10,
      }),
    }),
    plugins: [
      new UpdatedAtPlugin('updated_at'),
      new CamelCasePlugin({
        underscoreBeforeDigits: true,
      }),
    ],
  });
}
