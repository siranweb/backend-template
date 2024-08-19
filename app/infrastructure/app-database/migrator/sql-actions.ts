import { MigrationActions } from 'sql-migrations-core/dist/migrations-core/types/migrations-core.interface';
import { IAppDatabase } from '@/infrastructure/app-database/database';
import { sql } from 'kysely';
import { Migration } from 'sql-migrations-core/dist/migrations-core/types/shared';

export class SqlActions implements MigrationActions {
  constructor(private readonly db: IAppDatabase) {}

  async createMigrationTable(): Promise<void> {
    await this.db.schema
      .createTable('__migration')
      .ifNotExists()
      .addColumn('name', 'varchar', (cb) => cb.notNull().unique())
      .addColumn('migrated_at', 'timestamp', (cb) => cb.notNull().defaultTo(sql`now()`))
      .execute();
  }

  async getMigrationsNames(): Promise<string[]> {
    const records = await this.db.selectFrom('__migration').select('name').execute();
    return records.map((r) => r.name);
  }

  async migrateDown(migrations: Migration[]): Promise<void> {
    await this.db.transaction().execute(async (trx) => {
      for (const migration of migrations) {
        await trx.deleteFrom('__migration').where('name', '=', migration.name).execute();
        await sql`${migration.sql}`.execute(trx);
      }
    });
  }

  async migrateUp(migrations: Migration[]): Promise<void> {
    await this.db.transaction().execute(async (trx) => {
      for (const migration of migrations) {
        await trx.insertInto('__migration').values({ name: migration.name }).execute();
        await sql`${migration.sql}`.execute(trx);
      }
    });
  }
}
