import { ICryptographyService } from '@/core/cryptography/types/cryptography-service.interface';
import { ILogger } from '@/lib/logger/types/logger.interface';
import { TokenPair, UserCredentials } from '@/core/users/types/shared';
import { ICreateUserCase } from '@/core/users/types/create-user-case.interface';
import { IUsersRepository } from '@/core/users/types/users-repository.interface';
import { ICreateTokensCase } from '@/core/users/types/create-tokens-case.interface';
import { UserLoginTakenError } from '@/core/users/errors/user-login-taken.error';
import { User } from '@/core/users/entities/user.entity';

export class CreateUserCase implements ICreateUserCase {
  constructor(
    private readonly logger: ILogger,
    private readonly usersRepository: IUsersRepository,
    private readonly createTokensCase: ICreateTokensCase,
    private readonly cryptographyService: ICryptographyService,
  ) {}
  async execute(credentials: UserCredentials): Promise<TokenPair> {
    const { login, password } = credentials;
    this.logger.info('Starting user creating.', { login });

    const isLoginTaken = await this.checkIsLoginTaken(login);
    if (isLoginTaken) {
      throw new UserLoginTakenError({ login });
    }

    const user = await this.createUser(login, password);
    await this.usersRepository.saveUser(user);

    const tokens = await this.createTokensCase.execute(user.id);

    this.logger.info('User was created.', user);
    return tokens;
  }

  private async checkIsLoginTaken(login: string): Promise<boolean> {
    return !!(await this.usersRepository.getUserByLogin(login));
  }

  private async createUser(login: string, password: string): Promise<User> {
    const salt = this.cryptographyService.random(20);
    const passwordHash = await this.cryptographyService.hash(password, salt, 1000);

    return new User({
      login,
      passwordHash,
      salt,
    });
  }
}
