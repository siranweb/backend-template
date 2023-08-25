import { BaseEntity } from '@/lib/entities/base-entity';

export enum AccountRole {
  REGULAR = 'regular',
}

export interface AccountParams {
  id?: string;
  login: string;
  passwordHash: string;
  role?: AccountRole;
  salt: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Account extends BaseEntity {
  login: string;
  passwordHash: string;
  salt: string;
  role: AccountRole;

  constructor(data: AccountParams) {
    super(data);
    this.login = data.login;
    this.passwordHash = data.passwordHash;
    this.salt = data.salt;
    this.role = data.role ?? AccountRole.REGULAR;
  }

  comparePasswords(toCompare: string): boolean {
    return true;
  }
}
