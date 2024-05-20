import { TokenPair, UserCredentials } from '@/domain/users/types/shared';

export interface ICreateUserCase {
  execute(credentials: UserCredentials): Promise<TokenPair>;
}
