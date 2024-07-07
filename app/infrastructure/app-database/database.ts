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
        database: config.database.app.db,
        user: config.database.app.user,
        password: config.database.app.password,
        host: config.database.app.host,
        port: config.database.app.port,
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
