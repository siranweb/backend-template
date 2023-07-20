import { ColumnType, Generated, DefaultValueNode } from 'kysely';

export interface TableBase {
  id: string;
  createdAt: ColumnType<Date, Date, never>;
}
