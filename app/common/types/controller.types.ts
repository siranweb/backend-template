import { H3Event } from 'h3';

// TODO split

export type HandlerFunc = (event: H3Event) => any;
export type NextHandlerFunc = HandlerFunc;
export type ControllerPrototype = any;
export type Controller = any;
