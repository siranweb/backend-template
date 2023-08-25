import { TableBase } from '@/lib/database/tables/base';
import { AccountRole } from '@/app/users/entities/account.entity';

export interface AccountsTable extends TableBase {
  login: string;
  passwordHash: string;
  role: AccountRole;
  salt: string;
}
