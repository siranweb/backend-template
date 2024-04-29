import '@/app/common/global-imports';
import path from 'node:path';
import url from 'node:url';
import fsp from 'node:fs/promises';
import fs from 'node:fs';
import { askQuestion } from '@/app/common/utils/cli';
import * as console from 'console';
import process from 'node:process';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const databasesPath = path.join(__dirname, '../../src/app/databases');

const availableDatabases = await fsp.readdir(databasesPath);
const availableDatabasesStr = availableDatabases.map((name, index) => `(${index}) ${name}`).join(', ');
console.log('Available databases:', availableDatabasesStr);

const databaseInput = await askQuestion('Choose database: ');
const selectedDatabase = availableDatabases[+databaseInput] ?? availableDatabases.find(d => d === databaseInput);

if (!selectedDatabase) {
  console.error('No such database');
  process.exit();
}

const migrationName = await askQuestion('Enter migration name: ');
if (!migrationName) {
  console.error('Migration name cannot be empty');
  process.exit();
}

const databasePath = path.join(databasesPath, selectedDatabase);
const migrationsDirPath = path.join(databasePath, 'migrations');
const templatesPath = path.join(databasePath, 'migration-templates');

const migrationTemplateFileNames = await fsp.readdir(templatesPath);
for (const fileName of migrationTemplateFileNames) {
  const templatePath = path.join(templatesPath, fileName);
  const name = fileName.substring(0, fileName.lastIndexOf('.'));
  const newMigrationFileName = `${Date.now()}-${migrationName}.${name}.ts`;
  const newMigrationPath = path.join(migrationsDirPath, newMigrationFileName);
  if (!fs.existsSync(migrationsDirPath)) {
    await fsp.mkdir(migrationsDirPath);
  }

  await fsp.cp(templatePath, newMigrationPath);
}
