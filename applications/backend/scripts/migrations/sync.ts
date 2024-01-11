import '@/infra/common/global-imports';
import path from 'node:path';
import url from 'node:url';
import pg from 'pg';
import process from 'node:process';
import { Kysely, PostgresDialect } from 'kysely';
import { config } from '@/infra/config';
import { migrate } from '@/lib/kysely-migrations';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '../../src');

const db = new Kysely<any>({
  dialect: new PostgresDialect({
    pool: new pg.Pool({
      host: config.database.primary.host,
      port: config.database.primary.port,
      database: config.database.primary.db,
      user: config.database.primary.user,
      password: config.database.primary.password,
    }),
  }),
});

const migrationsDirPath = path.join(srcDir, 'infra/databases/app-database/migrations');

migrate(db, migrationsDirPath, 'sync').catch((error) => {
  console.error(error);
  process.exit(1);
});
