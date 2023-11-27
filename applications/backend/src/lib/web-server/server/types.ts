export interface EndpointMetadata {
  path: string;
  method: string;
}

export interface ControllerMetadata {}

export interface IController {
  [key: string]: any;
}
