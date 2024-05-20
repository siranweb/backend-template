import { UserNotFoundError } from '@/domain/users/errors/user-not-found.error';
import { UserWrongPasswordError } from '@/domain/users/errors/user-wrong-password.error';
import { ICryptographyService } from '@/domain/cryptography/types/cryptography-service.interface';
import { ILogger } from '@/infrastructure/logger/types/logger.interface';
import { ICreateTokensByCredentialsCase } from '@/domain/users/types/create-tokens-by-credentials-case.interface';
import { IUsersRepository } from '@/domain/users/types/users-repository.interface';
import { TokenPair, UserCredentials } from '@/domain/users/types/shared';
import { ICreateTokensCase } from '@/domain/users/types/create-tokens-case.interface';

export class CreateTokensByCredentialsCase implements ICreateTokensByCredentialsCase {
  constructor(
    private readonly logger: ILogger,
    private readonly usersRepository: IUsersRepository,
    private readonly cryptographyService: ICryptographyService,
    private readonly createTokensCase: ICreateTokensCase,
  ) {}
  async execute(credentials: UserCredentials): Promise<TokenPair> {
    const { login, password } = credentials;
    this.logger.info('Starting tokens creating by user credentials', { login });

    const user = await this.usersRepository.getUserByLogin(login);
    if (!user) {
      throw new UserNotFoundError();
    }

    const passwordHash = await this.cryptographyService.hash(password, user.salt, 1000);
    const isRightPassword = user.isCorrectPasswordHash(passwordHash);
    if (!isRightPassword) {
      throw new UserWrongPasswordError();
    }

    const tokens = await this.createTokensCase.execute(user.id);

    this.logger.info('Tokens were created by user credentials.', { user });

    return tokens;
  }
}
