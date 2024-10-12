import { databaseModule } from '@/infrastructure/database/database.module';
import { ISqlMigrator } from '@/lib/migrator/types/sql-migrator.interface';

databaseModule.init();

const migrator = databaseModule.resolve<ISqlMigrator>('dbMigrator');
await migrator.sync();
