import { Auth } from '@/infrastructure/web-server/chain-handlers/auth';
import { LogExample } from '@/infrastructure/web-server/chain-handlers/log-example';
import { appDi } from '@/infrastructure/ioc-container';
import { IValidateTokenCase } from '@/domain/users/types/validate-token.interface';

// TODO move to Awilix
const validateTokenCase = appDi.resolve<IValidateTokenCase>('validateTokenCase');

export const auth = new Auth(validateTokenCase);
export const logExample = new LogExample();
