import { ZodType } from 'zod';
import { OpenApiRequest } from './controller-definition.interface';

export type OpenApiRequestDecoratorParams = Omit<OpenApiRequest, 'body'> & {
  body?: OpenApiRequest['body'] | ZodType;
};

export type ControllerDecoratorParams = {
  prefix?: string;
  tags?: string[];
};
