import pg from 'pg';
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { UserTable } from '@/infrastructure/app-database/tables/user.table';
import { InvalidRefreshTokenTable } from '@/infrastructure/app-database/tables/invalid-refresh-token.table';
import { appDi } from '@/infrastructure/ioc-container';
import { IConfig } from '@/infrastructure/config/types/config.interface';
import { MigrationTable } from '@/infrastructure/app-database/tables/migration.table';

const config = appDi.resolve<IConfig>('config');

interface Database {
  user: UserTable;
  invalidRefreshToken: InvalidRefreshTokenTable;
  __migration: MigrationTable;
}
export type IAppDatabase = Kysely<Database>;

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
      new CamelCasePlugin({
        underscoreBeforeDigits: true,
      }),
    ],
  });
}
