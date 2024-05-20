import { User } from '@/domain/users/entities/user.entity';
import { UserLoginTakenError } from '@/domain/users/errors/user-login-taken.error';
import { IJWTService } from '@/domain/jwt/types/jwt-service.interface';
import { IConfig } from '@/infrastructure/config';
import { ICryptographyService } from '@/domain/cryptography/types/cryptography-service.interface';
import { ILogger } from '@/infrastructure/logger/types/logger.interface';
import { TokenPair, UserCredentials } from '@/domain/users/types/shared';
import { ICreateUserCase } from '@/domain/users/types/create-user-case.interface';
import { IUsersRepository } from '@/domain/users/types/users-repository.interface';

export class CreateUserCase implements ICreateUserCase {
  constructor(
    private readonly logger: ILogger,
    private readonly usersRepository: IUsersRepository,
    private readonly jwtService: IJWTService,
    private readonly cryptographyService: ICryptographyService,
    private readonly config: IConfig,
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

    const tokens = await this.createTokens(user.id);

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

  private async createTokens(userId: string): Promise<TokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.createToken({
        payload: {
          id: userId,
        },
        secret: this.config.jwt.secret,
        expirationTime: this.config.jwt.accessToken.expirationTime,
      }),
      await this.jwtService.createToken({
        payload: {
          id: userId,
        },
        secret: this.config.jwt.secret,
        expirationTime: this.config.jwt.refreshToken.expirationTime,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
