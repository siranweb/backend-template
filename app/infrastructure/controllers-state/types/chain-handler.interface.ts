import { H3Event } from 'h3';
import { NextHandlerFunc } from '@/common/types/controller.types';

export interface IChainHandler {
  handle: (event: H3Event, next: NextHandlerFunc) => any;
}
