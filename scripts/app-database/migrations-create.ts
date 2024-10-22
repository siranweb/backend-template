import { askQuestion } from '@/common/utils/cli';
import { databaseModule, databaseModuleTokens } from '@/infrastructure/database/database.module';
import { ISqlMigrator } from '@/lib/migrator/types/sql-migrator.interface';

const migrator: ISqlMigrator = databaseModule.resolve(databaseModuleTokens.dbMigrator);
const title = await askQuestion('Enter migration title: ');
await migrator.createFiles(title);
