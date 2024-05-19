import { IController } from '@/infrastructure/web-server/types/controller.interface';
import { IControllerDefinition } from '@/infrastructure/web-server/types/controller-definition.interface';
import { createControllerDefinition } from '@/infrastructure/web-server/controller-definitions/creator';
import { H3Event } from 'h3';
import { logExample } from '@/di/web-server.di';

const { Handler, Chain, Controller, definition } = createControllerDefinition();

@Controller('/example')
export class ExampleController implements IController {
  public readonly definition: IControllerDefinition = definition;

  @Handler('POST')
  public postExample(_event: H3Event): Record<string, any> {
    return { hello: 'world' };
  }

  @Handler('GET')
  @Chain(logExample)
  public async getExample(_event: H3Event): Promise<Record<string, any>> {
    return { hello: 'world' };
  }
}
