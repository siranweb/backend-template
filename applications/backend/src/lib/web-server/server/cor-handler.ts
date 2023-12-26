import { CORHandler } from '@/lib/chain-of-responsibility';
import { Context } from './types';

export const WebServerCORHandler = CORHandler<Context>;
