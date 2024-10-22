import { createBody } from '@/lib/controller-tools/decorator-creators/create-body';
import { createChain } from '@/lib/controller-tools/decorator-creators/create-chain';
import { createController } from '@/lib/controller-tools/decorator-creators/create-controller';
import { createCookie } from '@/lib/controller-tools/decorator-creators/create-cookie';
import { createHandler } from '@/lib/controller-tools/decorator-creators/create-handler';
import { createHeader } from '@/lib/controller-tools/decorator-creators/create-header';
import { createParams } from '@/lib/controller-tools/decorator-creators/create-params';
import { createQuery } from '@/lib/controller-tools/decorator-creators/create-query';
import { createResponse } from '@/lib/controller-tools/decorator-creators/create-response';
import {
  controllersStateModule,
  controllersStateModuleTokens,
} from '@/infrastructure/controllers-state/controllers-state.module';
import { createTag } from '@/lib/controller-tools/decorator-creators/create-tag';

const controllersState = controllersStateModule.resolve(
  controllersStateModuleTokens.controllersState,
);

export const Body = createBody(controllersState);
export const Chain = createChain(controllersState);
export const Controller = createController(controllersState);
export const Tag = createTag(controllersState);
export const Cookie = createCookie(controllersState);
export const Handler = createHandler(controllersState);
export const Header = createHeader(controllersState);
export const Params = createParams(controllersState);
export const Query = createQuery(controllersState);
export const Response = createResponse(controllersState);
