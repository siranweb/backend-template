import { AppDatabase } from '@/infrastructure/app-database/database';
import { User } from '@/domain/users/entities/user.entity';
import { UserTable } from '@/infrastructure/app-database/tables/user.table';
import { IUsersRepository } from '@/domain/users/types/users-repository.interface';

export class UsersRepository implements IUsersRepository {
  constructor(private readonly db: AppDatabase) {}

  async saveUser(user: User): Promise<User> {
    const result = await this.db
      .insertInto('user')
      .values(this.mapFromUser(user))
      .returningAll()
      .executeTakeFirstOrThrow();

    return this.mapToUser(result);
  }

  async getUserByLogin(login: string): Promise<User | null> {
    const result = await this.db
      .selectFrom('user')
      .where('login', '=', login)
      .selectAll()
      .executeTakeFirst();

    return result ? this.mapToUser(result) : null;
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await this.db
      .selectFrom('user')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    return result ? this.mapToUser(result) : null;
  }

  async storeInvalidRefreshToken(token: string): Promise<void> {
    await this.db
      .insertInto('invalid_refresh_token')
      .values({ token })
      .returning('token')
      .execute();
  }

  async isRefreshTokenUsed(token: string): Promise<boolean> {
    const result = await this.db
      .selectFrom('invalid_refresh_token')
      .where('token', '=', token)
      .select('token')
      .executeTakeFirst();
    return !!result;
  }

  private mapToUser(fields: Omit<UserTable, 'created_at'>): User {
    return new User({
      id: fields.id,
      salt: fields.salt,
      login: fields.login,
      passwordHash: fields.password_hash,
    });
  }

  private mapFromUser(user: User): Omit<UserTable, 'created_at'> {
    return {
      id: user.id,
      salt: user.salt,
      login: user.login,
      password_hash: user.passwordHash,
    };
  }
}
