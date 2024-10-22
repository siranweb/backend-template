import { ICryptographyService } from '@/core/cryptography/types/cryptography-service.interface';
import { ILogger } from '@/lib/logger/types/logger.interface';
import { ICreateTokensByCredentialsCase } from '@/core/users/types/create-tokens-by-credentials-case.interface';
import { IUsersRepository } from '@/core/users/types/users-repository.interface';
import { ICreateTokensCase } from '@/core/users/types/create-tokens-case.interface';
import { TokenPair, UserCredentials } from '@/core/users/types/shared';
import { UserNotFoundError } from '@/core/users/errors/user-not-found.error';
import { UserWrongPasswordError } from '@/core/users/errors/user-wrong-password.error';
import { inject } from 'di-wise';
import { usersModuleTokens } from '../users.module';
import { cryptographyModuleTokens } from '@/core/cryptography/cryptography.module';
import { injectLogger } from '@/infrastructure/shared/shared.module';

export class CreateTokensByCredentialsCase implements ICreateTokensByCredentialsCase {
  constructor(
    private readonly logger: ILogger = injectLogger(CreateTokensByCredentialsCase.name),
    private readonly usersRepository: IUsersRepository = inject(usersModuleTokens.usersRepository),
    private readonly cryptographyService: ICryptographyService = inject(
      cryptographyModuleTokens.cryptographyService,
    ),
    private readonly createTokensCase: ICreateTokensCase = inject(
      usersModuleTokens.createTokensCase,
    ),
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
