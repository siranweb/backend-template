import { TokenPair, UserCredentials } from '@/domain/users/types/shared';

export interface ICreateTokensByCredentialsCase {
  execute(credentials: UserCredentials): Promise<TokenPair>;
}
