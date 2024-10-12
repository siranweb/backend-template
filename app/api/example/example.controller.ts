import { H3Event } from 'h3';
import {
  Body,
  Controller,
  Handler,
  Params,
  Query,
  Response,
} from '@/infrastructure/controllers-state/decorators';
import { createExampleSchema } from '@/api/example/schemas/create-example.schema';
import { getExampleQuerySchema } from '@/api/example/schemas/get-example-query.schema';
import { exampleResponseSchema } from '@/api/example/schemas/example-response.schema';
import { getExampleByIdParamsSchema } from '@/api/example/schemas/get-example-by-id-params.schema';

@Controller('/example')
export class ExampleController {
  @Handler('POST')
  @Body(createExampleSchema)
  public async postExample(_event: H3Event): Promise<Record<string, any>> {
    return { hello: 'world' };
  }

  @Handler('GET')
  @Query(getExampleQuerySchema)
  @Response(200, exampleResponseSchema)
  public async getExample(_event: H3Event): Promise<Record<string, any>> {
    return { hello: 'world' };
  }

  @Handler('GET', '/:id')
  @Params(getExampleByIdParamsSchema)
  @Response(200, exampleResponseSchema)
  public async getExampleById(_event: H3Event): Promise<Record<string, any>> {
    return { hello: 'world' };
  }
}
