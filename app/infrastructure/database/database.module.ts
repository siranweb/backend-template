import { Module } from '@/lib/module';
import { asFunction } from 'awilix';
import { makeDatabase } from '@/infrastructure/database/make-database';
import { ISqlMigrator } from '@/lib/migrator/types/sql-migrator.interface';
import { makeSqlMigrator } from '@/lib/migrator/sql/make-sql-migrator';
import { IAppDatabase } from '@/infrastructure/database/types/database.types';
import { sharedModule } from '@/infrastructure/shared/shared.module';

export const databaseModule = new Module('database');
databaseModule.use(sharedModule);

databaseModule.register<IAppDatabase>('db', asFunction(makeDatabase).singleton());
databaseModule.register<ISqlMigrator>('dbMigrator', asFunction(makeSqlMigrator).singleton());
