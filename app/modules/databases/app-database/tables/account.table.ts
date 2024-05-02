import { TableBase } from './base';

export interface AccountTable extends TableBase {
  login: string;
  passwordHash: string;
  salt: string;
}
