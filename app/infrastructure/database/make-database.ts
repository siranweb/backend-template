import pg from 'pg';
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { IConfig } from '@/infrastructure/shared/types/config.interface';
import { IAppDatabase } from '@/infrastructure/database/types/database.types';

export function makeDatabase(config: IConfig): IAppDatabase {
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
