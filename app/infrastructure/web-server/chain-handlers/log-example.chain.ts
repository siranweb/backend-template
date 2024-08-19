import { H3Event } from 'h3';
import { NextHandlerFunc } from '@/infrastructure/web-server/types/shared';
import { IChainHandler } from '@/infrastructure/web-server/types/chain-handler.interface';

export class LogExampleChain implements IChainHandler {
  async handle(event: H3Event, next: NextHandlerFunc) {
    console.log('hey');
    return next(event);
  }
}
