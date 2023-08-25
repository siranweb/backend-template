import { TableBase } from '@/lib/database/tables/base';

export interface UsersTable extends TableBase {
  login: string;
  passwordHash: string;
  firstName: string;
  lastName: string | null;
}
