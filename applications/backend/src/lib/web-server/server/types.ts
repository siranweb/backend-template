import { HTTPMethod, HTTPVersion, Handler } from 'find-my-way';

export interface EndpointMetadata {
  path: string;
  method: HTTPMethod;
}

export interface ControllerMetadata {
  // prefix: string;
}

export type EndpointHandler = Handler<HTTPVersion.V1>;

export type Request = Parameters<EndpointHandler>[0];
export type Response = Parameters<EndpointHandler>[1];
export type Params = Parameters<EndpointHandler>[2];
export type Store = Parameters<EndpointHandler>[3];
export type SearchParams = Parameters<EndpointHandler>[4];

export interface IController {
  [key: string]: EndpointHandler | any;
}
