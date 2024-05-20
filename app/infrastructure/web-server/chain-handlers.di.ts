import { Auth } from '@/infrastructure/web-server/chain-handlers/auth';
import { validateTokenCase } from '@/domain/users/di';
import { LogExample } from '@/infrastructure/web-server/chain-handlers/log-example';

export const auth = new Auth(validateTokenCase);
export const logExample = new LogExample();
