import { H3Event } from 'h3';
import { NextHandlerFunc } from '@/infrastructure/web-server/types/shared';

export interface IChainHandler {
  handle: (event: H3Event, next: NextHandlerFunc) => any;
}
