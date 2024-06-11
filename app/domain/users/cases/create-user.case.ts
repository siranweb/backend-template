import { User } from '@/domain/users/entities/user.entity';
import { UserLoginTakenError } from '@/domain/users/errors/user-login-taken.error';
import { ICryptographyService } from '@/domain/cryptography/types/cryptography-service.interface';
import { ILogger } from '@/infrastructure/logger/types/logger.interface';
import { TokenPair, UserCredentials } from '@/domain/users/types/shared';
import { ICreateUserCase } from '@/domain/users/types/create-user-case.interface';
import { IUsersRepository } from '@/domain/users/types/users-repository.interface';
import { ICreateTokensCase } from '@/domain/users/types/create-tokens-case.interface';

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
