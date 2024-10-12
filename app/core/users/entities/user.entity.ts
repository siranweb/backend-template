import { uuidv7 } from 'uuidv7';

export class User {
  id: string;
  login: string;
  passwordHash: string;
  salt: string;

  constructor(data: UserParams) {
    this.id = data.id ?? uuidv7();
    this.login = data.login;
    this.passwordHash = data.passwordHash;
    this.salt = data.salt;
  }

  public isCorrectPasswordHash(hash: string): boolean {
    return hash === this.passwordHash;
  }
}

export interface UserParams {
  id?: string;
  login: string;
  passwordHash: string;
  salt: string;
}
