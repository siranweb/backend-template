import { Auth } from '@/infrastructure/web-server/chain-handlers/auth';
import { validateAccessTokenCase } from '@/domain/users/di';
import { LogExample } from '@/infrastructure/web-server/chain-handlers/log-example';

export const auth = new Auth(validateAccessTokenCase);
export const logExample = new LogExample();
