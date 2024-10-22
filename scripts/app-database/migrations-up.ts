import { databaseModule, databaseModuleTokens } from '@/infrastructure/database/database.module';
import { ISqlMigrator } from '@/lib/migrator/types/sql-migrator.interface';

const migrator: ISqlMigrator = databaseModule.resolve(databaseModuleTokens.dbMigrator);
await migrator.up();
