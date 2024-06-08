import { H3Event } from 'h3';
import {
  Controller,
  Handler,
  Response,
} from '@/infrastructure/web-server/controllers-definition/decorators';
import { IOpenApi } from '@/infrastructure/web-server/open-api/types/open-api-builder.interface';
import { redocTemplate } from '@/infrastructure/redoc/template';

@Controller('/docs')
export class DocsController {
  constructor(private readonly openApi: IOpenApi) {}

  @Handler('GET')
  @Response(200, 'text/html')
  public async getDocs(_event: H3Event): Promise<string> {
    return redocTemplate
      .replace('[[title]]', 'Docs')
      .replace('[[specUrl]]', '"/docs/open-api.json"');
  }

  @Handler('GET', '/open-api.json')
  @Response(200, {})
  public async getOpenApiSpec(_event: H3Event): Promise<Record<string, any>> {
    return this.openApi.build();
  }
}
