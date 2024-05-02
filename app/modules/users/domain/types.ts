import { Account } from '@/modules/users/entities/account.entity';

export interface ICreateAccountCase {
  execute(params: CreateAccountCaseParams): Promise<CreateAccountCaseResult>;
}

export interface ICreateTokensByRefreshTokenCase {
  execute(oldRefreshToken: string): Promise<TokenPair>;
}

export interface IInvalidateRefreshTokenCase {
  execute(token: string): Promise<void>;
}

export interface ILoginCase {
  execute(login: string, password: string): Promise<TokenPair>;
}

export interface IValidateAccessTokenCase {
  execute(accessToken: string): Promise<boolean>;
}

export interface IUsersRepository {
  saveAccount(account: Account): Promise<Account>;
  getAccountByLogin(login: string): Promise<Account | null>;
  getAccountById(id: string): Promise<Account | null>;
  storeInvalidRefreshToken(token: string): Promise<void>;
  isRefreshTokenUsed(token: string): Promise<boolean>;
}

export type CreateAccountCaseParams = {
  login: string;
  password: string;
};

export type CreateAccountCaseResult = {
  account: Account;
  accessToken: string;
  refreshToken: string;
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};
