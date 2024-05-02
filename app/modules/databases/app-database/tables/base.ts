import { Generated } from 'kysely';

export interface TableBase {
  id: string;
  createdAt: Generated<Date>;
}
