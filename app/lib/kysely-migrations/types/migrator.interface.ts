import { Kysely } from 'kysely';

export interface IMigrator {
  getLatest(): Promise<string | null>;
  migrateUp(migrations: Migration[]): Promise<void>;
  migrateDown(migrations: Migration[]): Promise<void>;
}

export type MigratorConfig = {
  db: Kysely<any>;
  tableName?: string;
};

export type Migration = {
  query: string;
  name: string;
};

export type MigrationRow = {
  migration_name: string;
  created_at: Date;
};
