import { ControllerPrototype } from '@/infrastructure/web-server/types/shared';

export interface IControllerInitializer {
  init(controller: ControllerPrototype): this;
}
