export interface EndpointMetadata {
  path: string;
  method: string;
}

export interface ControllerMetadata {
  // prefix: string;
}

export interface IController {
  [key: string]: any;
}
