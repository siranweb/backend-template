import { uuidv7 } from 'uuidv7';

export class Account {
  id: string;
  login: string;
  passwordHash: string;
  salt: string;

  constructor(data: AccountParams) {
    this.id = data.id ?? uuidv7();
    this.login = data.login;
    this.passwordHash = data.passwordHash;
    this.salt = data.salt;
  }

  public comparePasswordHash(hash: string): boolean {
    return hash === this.passwordHash;
  }
}

export interface AccountParams {
  id?: string;
  login: string;
  passwordHash: string;
  salt: string;
}
