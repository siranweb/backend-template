import { H3Event } from 'h3';
import {
  Body,
  Chain,
  Controller,
  Handler,
  Params,
  Query,
  Response,
} from '@/infrastructure/web-server/controllers-definition/decorators';
import { createExampleSchema } from '@/api/example/schemas/create-example.schema';
import { getExampleQuerySchema } from '@/api/example/schemas/get-example-query.schema';
import { exampleResponseSchema } from '@/api/example/schemas/example-response.schema';
import { getExampleByIdParamsSchema } from '@/api/example/schemas/get-example-by-id-params.schema';
import { appDi } from '@/infrastructure/ioc-container';
import { IChainHandler } from '@/infrastructure/web-server/types/chain-handler.interface';

const logExample = appDi.resolve<IChainHandler>('logExampleChain');

@Controller('/example')
@Chain(logExample)
export class ExampleController {
  @Handler('POST')
  @Body(createExampleSchema)
  public async postExample(_event: H3Event): Promise<Record<string, any>> {
    return { hello: 'world' };
  }

  @Handler('GET')
  @Chain(logExample)
  @Query(getExampleQuerySchema)
  @Response(200, exampleResponseSchema)
  public async getExample(_event: H3Event): Promise<Record<string, any>> {
    return { hello: 'world' };
  }

  @Handler('GET', '/:id')
  @Chain(logExample)
  @Params(getExampleByIdParamsSchema)
  @Response(200, exampleResponseSchema)
  public async getExampleById(_event: H3Event): Promise<Record<string, any>> {
    return { hello: 'world' };
  }
}
