import { TableBase } from './base';

export type InvalidRefreshTokenTable = TableBase & {
  token: string;
};
