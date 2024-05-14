import { Context } from '@/lib/web-server';
import { createControllerDefinition } from '@/modules/common/definitions/controller/creator';
import { IController } from '@/modules/common/types/controller.interface';
import { IControllerDefinition } from '@/modules/common/types/controller-definition.interface';
import { IRedoc } from '@/lib/redoc';
import { HttpMethod } from '@/modules/common/types/http-method';

const { Handler, Controller, OpenApiRequest, OpenApiResponse, definition } =
  createControllerDefinition();

@Controller({ prefix: '/docs' })
export class DocsController implements IController {
  public readonly definition: IControllerDefinition = definition;

  constructor(private readonly redoc: IRedoc) {}

  @Handler(HttpMethod.GET, '/redoc')
  @OpenApiRequest({
    summary: 'Get redoc document',
  })
  @OpenApiResponse({
    contentType: 'text/html',
    description: 'Redoc document',
  })
  async getRedoc(ctx: Context) {
    ctx.res.setHeader('Content-Type', 'text/html');
    ctx.res.end(this.redoc.make());
  }
}
