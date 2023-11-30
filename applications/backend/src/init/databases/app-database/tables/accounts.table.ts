import { TableBase } from './base';

enum AccountRole {
  REGULAR = 'regular',
}

export interface AccountsTable extends TableBase {
  login: string;
  passwordHash: string;
  role: AccountRole;
  salt: string;
}
