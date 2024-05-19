import { MigrationsService } from '@/lib/kysely-migrations';
import { appDatabase } from '@/infrastructure/app-database/database';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const migrationsService = new MigrationsService(appDatabase);
const migrationsPath = path.join(__dirname, '../migrations');

await migrationsService.up(migrationsPath);
