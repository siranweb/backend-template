import { TableBase } from './base';

export type UserTable = TableBase & {
  id: string;
  login: string;
  passwordHash: string;
  salt: string;
};
