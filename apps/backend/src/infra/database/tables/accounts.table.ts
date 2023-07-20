import { TableBase } from '@/infra/database/tables/base';
import { AccountRole } from '@/application/users/entities/account.entity';

export interface AccountsTable extends TableBase {
  login: string;
  passwordHash: string;
  role: AccountRole;
  salt: string;
}
