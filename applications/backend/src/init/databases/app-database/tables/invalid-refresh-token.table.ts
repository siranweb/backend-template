import { TableBase } from './base';

export interface InvalidRefreshTokenTable extends Pick<TableBase, 'createdAt'> {
  token: string;
}
