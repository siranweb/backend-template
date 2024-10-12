import { TokenPair, UserCredentials } from '@/core/users/types/shared';

export interface ICreateUserCase {
  execute(credentials: UserCredentials): Promise<TokenPair>;
}
