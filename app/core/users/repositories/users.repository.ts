import { IAppDatabase } from '@/infrastructure/database/types/database.types';
import { IUsersRepository } from '@/core/users/types/users-repository.interface';
import { User } from '@/core/users/entities/user.entity';
import { inject } from 'di-wise';
import { databaseModuleTokens } from '@/infrastructure/database/database.module';

export class UsersRepository implements IUsersRepository {
  constructor(private readonly db: IAppDatabase = inject(databaseModuleTokens.db)) {}

  async saveUser(user: User): Promise<User> {
    const result = await this.db
      .insertInto('user')
      .values(user)
      .returningAll()
      .executeTakeFirstOrThrow();

    return new User(result);
  }

  async getUserByLogin(login: string): Promise<User | null> {
    const result = await this.db
      .selectFrom('user')
      .where('login', '=', login)
      .selectAll()
      .executeTakeFirst();

    return result ? new User(result) : null;
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await this.db
      .selectFrom('user')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    return result ? new User(result) : null;
  }

  async storeInvalidRefreshToken(token: string): Promise<void> {
    await this.db.insertInto('invalidRefreshToken').values({ token }).returning('token').execute();
  }

  async isRefreshTokenUsed(token: string): Promise<boolean> {
    const result = await this.db
      .selectFrom('invalidRefreshToken')
      .where('token', '=', token)
      .select('token')
      .executeTakeFirst();
    return !!result;
  }
}
