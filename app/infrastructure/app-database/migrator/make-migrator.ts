import url from 'node:url';
import path from 'node:path';
import { MigrationsCore } from 'sql-migrations-core';
import { IMigrator } from '@/infrastructure/app-database/migrator/types';
import { IAppDatabase } from '@/infrastructure/app-database/database';
import { SqlActions } from '@/infrastructure/app-database/migrator/sql-actions';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export function makeMigrator(db: IAppDatabase): IMigrator {
  return MigrationsCore.create({
    path: path.join(__dirname, '../migrations'),
    sqlActions: new SqlActions(db),
  });
}
