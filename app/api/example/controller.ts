import { H3Event } from 'h3';
import { logExample } from '@/infrastructure/web-server/chain-handlers.di';
import {
  Chain,
  Controller,
  Handler,
} from '@/infrastructure/web-server/controllers-definition/decorators';

@Controller('/example')
@Chain(logExample)
export class ExampleController {
  @Handler('POST')
  public async postExample(_event: H3Event): Promise<Record<string, any>> {
    return { hello: 'world' };
  }

  @Handler('GET')
  @Chain(logExample)
  public async getExample(_event: H3Event): Promise<Record<string, any>> {
    return { hello: 'world' };
  }
}
