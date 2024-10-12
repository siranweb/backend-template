import path from 'node:path';
import { MigrationsCore } from 'sql-migrations-core';
import { ISqlMigrator } from '@/lib/migrator/types/sql-migrator.interface';
import { IAppDatabase } from '@/infrastructure/database/types/database.types';
import { SqlActions } from '@/lib/migrator/sql/sql-actions';

export function makeSqlMigrator(db: IAppDatabase): ISqlMigrator {
  return MigrationsCore.create({
    path: path.join(basePath, 'migrations'),
    sqlActions: new SqlActions(db),
  });
}
