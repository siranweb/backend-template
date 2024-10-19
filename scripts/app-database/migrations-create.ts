import { askQuestion } from '@/common/utils/cli';
import { databaseModule } from '@/infrastructure/database/database.module';
import { ISqlMigrator } from '@/lib/migrator/types/sql-migrator.interface';

databaseModule.init();

const migrator = databaseModule.resolve<ISqlMigrator>('dbMigrator');
const title = await askQuestion('Enter migration title: ');
await migrator.createFiles(title);
