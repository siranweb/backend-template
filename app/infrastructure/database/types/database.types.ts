import { UserTable } from '@/infrastructure/database/tables/user.table';
import { InvalidRefreshTokenTable } from '@/infrastructure/database/tables/invalid-refresh-token.table';
import { MigrationTable } from '@/infrastructure/database/tables/migration.table';
import { Kysely } from 'kysely';

type Database = {
  user: UserTable;
  invalidRefreshToken: InvalidRefreshTokenTable;
  __migration: MigrationTable;
};
export type IAppDatabase = Kysely<Database>;
