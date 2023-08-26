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

export class Account {
  id: string;
  login: string;
  passwordHash: string;
  salt: string;
  role: AccountRole;

  constructor(data: AccountParams) {
    this.id = data.id ?? ''; // TODO uuid
    this.login = data.login;
    this.passwordHash = data.passwordHash;
    this.salt = data.salt;
    this.role = data.role ?? AccountRole.REGULAR;
  }

  comparePasswords(toCompare: string): boolean {
    return true;
  }
}
