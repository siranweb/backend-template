import '@/infra/common/global-imports';
import path from 'node:path';
import url from 'node:url';
import fsp from 'node:fs/promises';
import fs from 'node:fs';
import { askQuestion } from '@/utils/cli';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '../../src');

const migrationName = await askQuestion('Enter migration name: ');

const migrationsDirPath = path.join(srcDir, 'init/databases/app-database/migrations');
const templatePath = path.join(srcDir, 'lib/kysely-migrations/template.ts');
const newMigrationFileName = migrationName ? `${Date.now()}-${migrationName}.ts` : `${Date.now()}.ts`;
const newMigrationPath = path.join(migrationsDirPath, newMigrationFileName);

if (!fs.existsSync(migrationsDirPath)) {
  await fsp.mkdir(migrationsDirPath);
}

await fsp.cp(templatePath, newMigrationPath);
