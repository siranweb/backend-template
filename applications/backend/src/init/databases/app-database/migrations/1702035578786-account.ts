/* eslint-disable */
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('account')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('login', 'varchar(40)', (col) => col.notNull())
    .addColumn('passwordHash', 'varchar', (col) => col.notNull())
    .addColumn('salt', 'varchar', (col) => col.notNull())
    .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('account').execute();
}
