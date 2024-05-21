import { TableBase } from './base';

export interface UserTable extends TableBase {
  id: string;
  login: string;
  passwordHash: string;
  salt: string;
}
