import { TableBase } from '@/init/databases/app-database/tables/base';

export interface UsersTable extends TableBase {
  login: string;
  passwordHash: string;
  firstName: string;
  lastName: string | null;
}
