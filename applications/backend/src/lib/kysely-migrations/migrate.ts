import path from 'node:path';
import fsp from 'node:fs/promises';
import { Kysely, Migrator, FileMigrationProvider, MigrationResultSet } from 'kysely';

type MigrationMode = 'sync' | 'up' | 'down';

function getMigrateFuncByMode(migrator: Migrator, mode: MigrationMode): () => Promise<MigrationResultSet> {
  if (mode === 'sync') return migrator.migrateToLatest.bind(migrator);
  if (mode === 'up') return migrator.migrateUp.bind(migrator);
  if (mode === 'down') return migrator.migrateDown.bind(migrator);
  throw new Error(`Unknown ${mode} mode`);
}

export async function migrate(db: Kysely<any>, migrationsDirPath: string, mode: MigrationMode) {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs: fsp,
      path,
      migrationFolder: migrationsDirPath,
    }),
  });

  const migrateFunc = getMigrateFuncByMode(migrator, mode);
  const { error, results } = await migrateFunc();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    throw error;
  }

  await db.destroy();
}
