/* eslint-disable */
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('invalidRefreshToken')
    .addColumn('token', 'varchar(100)', (col) => col.notNull().primaryKey())
    .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('invalidRefreshToken').execute();
}
