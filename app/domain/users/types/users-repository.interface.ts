import { User } from '@/domain/users/entities/user.entity';

export interface IUsersRepository {
  saveUser(user: User): Promise<User>;
  getUserByLogin(login: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  storeInvalidRefreshToken(token: string): Promise<void>;
  isRefreshTokenUsed(token: string): Promise<boolean>;
}
