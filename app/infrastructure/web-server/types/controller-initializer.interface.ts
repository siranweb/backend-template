import { Controller } from '@/common/types/controller.types';
import { Router } from 'h3';
import { IOpenApiBuilder } from '@/lib/open-api/types/open-api-builder.interface';

export interface IControllerInitializer {
  init(controller: Controller, router: Router, openApiBuilder?: IOpenApiBuilder): void;
}
