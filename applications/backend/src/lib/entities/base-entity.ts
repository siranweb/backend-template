import dayjs from 'dayjs';

export interface BaseEntityParams {
  id: string;
  createdAt: Date;
}

export abstract class BaseEntity {
  id: string;
  readonly createdAt: Date;

  protected constructor(data: Partial<BaseEntityParams>) {
    this.id = data?.id ?? '';
    this.createdAt = data?.createdAt ?? dayjs().utc().toDate();
  }
}