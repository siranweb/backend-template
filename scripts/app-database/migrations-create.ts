import { MigrationsService } from '@/lib/kysely-migrations';
import { appDatabase } from '@/infrastructure/app-database/database';
import { askQuestion } from '@/common/utils/cli';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const migrationsService = new MigrationsService(appDatabase);
const migrationsPath = path.join(__dirname, '../../app/infrastructure/app-database/migrations');

const migrationName = await askQuestion('Enter migration name: ');

await migrationsService.create(migrationsPath, migrationName);
