import { TokenPair, UserCredentials } from '@/core/users/types/shared';

export interface ICreateTokensByCredentialsCase {
  execute(credentials: UserCredentials): Promise<TokenPair>;
}
