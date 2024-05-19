import { IChainHandler, NextHandlerFunc } from '@/infrastructure/web-server/types/shared';
import { H3Event } from 'h3';

export class LogExample implements IChainHandler {
  async handle(event: H3Event, next: NextHandlerFunc) {
    console.log('hey');
    return next(event);
  }
}
