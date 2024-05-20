import { TableBase } from './base';

export interface InvalidRefreshTokenTable extends TableBase {
  token: string;
}
