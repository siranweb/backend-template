import { Generated } from 'kysely';

export interface TableBase {
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}
