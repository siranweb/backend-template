import { Module } from '@/lib/module';
import { makeDatabase } from '@/infrastructure/database/make-database';
import { ISqlMigrator } from '@/lib/migrator/types/sql-migrator.interface';
import { makeSqlMigrator } from '@/infrastructure/database/make-sql-migrator';
import { IAppDatabase } from '@/infrastructure/database/types/database.types';
import { sharedModule } from '@/infrastructure/shared/shared.module';
import { Type } from 'di-wise';

export const databaseModule = new Module('database');
databaseModule.import(sharedModule);

export const databaseModuleTokens = {
  db: Type<IAppDatabase>('db'),
  dbMigrator: Type<ISqlMigrator>('dbMigrator'),
};

databaseModule.register(databaseModuleTokens.db, { useFactory: makeDatabase });
databaseModule.register(databaseModuleTokens.dbMigrator, { useFactory: makeSqlMigrator });
