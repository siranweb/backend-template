import { Kysely, sql, Transaction } from 'kysely';
import { IMigrator, Migration, MigrationRow, MigratorConfig } from './types/migrator.interface';

export class Migrator implements IMigrator {
  private readonly db: Kysely<any>;
  private readonly tableName: string;

  constructor(config: MigratorConfig) {
    this.db = config.db;
    this.tableName = config.tableName ?? '__migrations';
  }

  public async getLatest(): Promise<string | null> {
    const row = await this.getLastMigrationFromTable();
    return row?.migration_name ?? null;
  }

  public async migrateUp(migrations: Migration[]): Promise<void> {
    try {
      await this.createMigrationsTableIfNotExists();
      await this.processUpMigrationQueries(migrations);
    } catch (error: any) {
      throw new Error(`[Up] ${error.message}`);
    }
  }

  public async migrateDown(migrations: Migration[]): Promise<void> {
    try {
      await this.createMigrationsTableIfNotExists();
      await this.processDownMigrationQueries(migrations);
    } catch (error: any) {
      throw new Error(`[Down] ${error.message}`);
    }
  }

  private async processDownMigrationQueries(migrations: Migration[]): Promise<void> {
    await this.db.transaction().execute(async (trx) => {
      for (const migration of migrations) {
        const migrationRow = await this.getMigrationFromTable(migration.name, trx);
        if (!migrationRow) {
          throw new Error(`Migration ${migration.name} not found.`);
        }

        const lastMigrationRow = await this.getLastMigrationFromTable(trx);
        if (migrationRow !== lastMigrationRow) {
          throw new Error(
            `Migration ${migration.name} cannot be executed. Execute ${
              lastMigrationRow!.migration_name
            } first.`,
          );
        }
        await sql`${migration.query}`.execute(trx);
        await this.deleteMigrationFromTable(migration.name, trx);
      }
    });
  }

  private async processUpMigrationQueries(migrations: Migration[]): Promise<void> {
    await this.db.transaction().execute(async (trx) => {
      for (const migration of migrations) {
        const migrationRow = await this.getMigrationFromTable(migration.name, trx);
        if (migrationRow) {
          continue;
        }
        await sql`${migration.query}`.execute(trx);
        await this.addMigrationToTable(migration.name, trx);
      }
    });
  }

  private async createMigrationsTableIfNotExists(): Promise<void> {
    await this.db.schema
      .createTable(this.tableName)
      .ifNotExists()
      .addColumn('migration_name', 'text', (col) => col.notNull().unique())
      .addColumn('created_at', 'timestamp', (col) => col.notNull())
      .execute();
  }

  private async addMigrationToTable(migrationName: string, trx?: Transaction<any>): Promise<void> {
    await (trx ?? this.db)
      .insertInto(this.tableName)
      .values({
        migration_name: migrationName,
        created_at: Date.now(),
      })
      .execute();
  }

  private async getMigrationFromTable(
    migrationName: string,
    trx?: Transaction<any>,
  ): Promise<MigrationRow | null> {
    const [migrationRow] = (await (trx ?? this.db)
      .selectFrom(this.tableName)
      .where('migration_name', '=', migrationName)
      .limit(1)
      .execute()) as (MigrationRow | undefined)[];
    return migrationRow ?? null;
  }

  private async getLastMigrationFromTable(trx?: Transaction<any>): Promise<MigrationRow | null> {
    const [migrationRow] = (await (trx ?? this.db)
      .selectFrom(this.tableName)
      .limit(1)
      .orderBy('created_at', 'asc')
      .execute()) as (MigrationRow | undefined)[];
    return migrationRow ?? null;
  }

  private async deleteMigrationFromTable(
    migrationName: string,
    trx?: Transaction<any>,
  ): Promise<void> {
    await (trx ?? this.db)
      .deleteFrom(this.tableName)
      .where('migration_name', '=', migrationName)
      .limit(1)
      .execute();
  }
}
