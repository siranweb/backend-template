import { H3Event } from 'h3';

export interface IChainHandler {
  handle: (event: H3Event, next: NextHandlerFunc) => any;
}

export interface IErrorHandler {
  handle: ErrorHandlerFunc;
}

export type HandlerFunc = (event: H3Event) => any;
export type NextHandlerFunc = HandlerFunc;
export type ErrorHandlerFunc = (error: unknown) => void;
