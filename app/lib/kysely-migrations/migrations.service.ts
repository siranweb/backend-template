import fsp from 'node:fs/promises';
import path from 'node:path';
import { DOWN_MIGRATION_FILE_EXTENSION, UP_MIGRATION_FILE_EXTENSION } from './constants';
import { IMigrationsService } from './types/migrations.service.interface';
import { Kysely } from 'kysely';
import { IMigrator, Migration } from './types/migrator.interface';
import { Migrator } from './migrator';

export class MigrationsService implements IMigrationsService {
  private readonly migrator: IMigrator;
  constructor(db: Kysely<any>) {
    this.migrator = new Migrator({ db });
  }

  public async down(migrationsPath: string): Promise<void> {
    const migrationsFileNames = await fsp.readdir(migrationsPath);

    const downMigrationsFileName = await this.getDownMigrationFileNameToProcess(
      migrationsFileNames,
    );

    if (!downMigrationsFileName) {
      return;
    }

    const migrations: Migration[] = await this.getMigrations(
      migrationsPath,
      [downMigrationsFileName],
      DOWN_MIGRATION_FILE_EXTENSION,
    );
    await this.migrator.migrateUp(migrations);
  }

  public async up(migrationsPath: string): Promise<void> {
    const migrationsFileNames = await fsp.readdir(migrationsPath);

    const upMigrationsFileName = await this.getUpMigrationFileNameToProcess(migrationsFileNames);

    if (!upMigrationsFileName) {
      return;
    }

    const migrations: Migration[] = await this.getMigrations(
      migrationsPath,
      [upMigrationsFileName],
      UP_MIGRATION_FILE_EXTENSION,
    );
    await this.migrator.migrateUp(migrations);
  }

  public async sync(migrationsPath: string): Promise<void> {
    const migrationsFileNames = await fsp.readdir(migrationsPath);

    const upMigrationsFileNames = await this.getUpMigrationFileNamesToProcess(migrationsFileNames);

    const migrations: Migration[] = await this.getMigrations(
      migrationsPath,
      upMigrationsFileNames,
      UP_MIGRATION_FILE_EXTENSION,
    );

    await this.migrator.migrateUp(migrations);
  }

  public async create(migrationsPath: string, name: string): Promise<void> {
    const now = Date.now();
    const upMigrationPath = path.join(
      migrationsPath,
      `${now}-${name}.${UP_MIGRATION_FILE_EXTENSION}`,
    );
    const downMigrationPath = path.join(
      migrationsPath,
      `${now}-${name}.${DOWN_MIGRATION_FILE_EXTENSION}`,
    );
    await Promise.all([fsp.writeFile(upMigrationPath, ''), fsp.writeFile(downMigrationPath, '')]);
  }

  private async getDownMigrationFileNameToProcess(
    downMigrationsFileNames: string[],
  ): Promise<string | null> {
    const latestMigrationName = await this.migrator.getLatest();

    if (!latestMigrationName) {
      return null;
    }

    return (
      downMigrationsFileNames.find((fileName) => {
        return (
          fileName.startsWith(latestMigrationName) &&
          fileName.endsWith(DOWN_MIGRATION_FILE_EXTENSION)
        );
      }) ?? null
    );
  }

  private async getUpMigrationFileNameToProcess(
    upMigrationsFileNames: string[],
  ): Promise<string | null> {
    const latestMigrationName = await this.migrator.getLatest();
    const latestMigrationTimestamp = latestMigrationName ? +latestMigrationName.split('-')[0] : 0;

    return (
      upMigrationsFileNames.find((fileName) => {
        const timestamp = +fileName.split('-')[0];
        return (
          timestamp > latestMigrationTimestamp && fileName.endsWith(UP_MIGRATION_FILE_EXTENSION)
        );
      }) ?? null
    );
  }

  private async getUpMigrationFileNamesToProcess(
    upMigrationsFileNames: string[],
  ): Promise<string[]> {
    const latestMigrationName = await this.migrator.getLatest();
    const latestMigrationTimestamp = latestMigrationName ? +latestMigrationName.split('-')[0] : 0;

    return upMigrationsFileNames.filter((fileName) => {
      const timestamp = +fileName.split('-')[0];
      return timestamp > latestMigrationTimestamp && fileName.endsWith(UP_MIGRATION_FILE_EXTENSION);
    });
  }

  private async getMigrations(
    migrationsPath: string,
    migrationsFileNames: string[],
    extension: string,
  ): Promise<Migration[]> {
    const clb = async (fileName: string): Promise<Migration> => {
      const name = fileName.split(`.${extension}`)[0];
      const migrationFilePath = path.join(migrationsPath, fileName);
      const query = await fsp.readFile(migrationFilePath, 'utf8');
      return { query, name };
    };
    return Promise.all(migrationsFileNames.map(clb));
  }
}
