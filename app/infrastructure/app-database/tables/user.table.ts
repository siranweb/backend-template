import { TableBase } from './base';

export interface UserTable extends TableBase {
  id: string;
  login: string;
  password_hash: string;
  salt: string;
}
