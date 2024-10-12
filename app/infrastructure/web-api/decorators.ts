import { createBody } from '@/lib/controller-tools/decorator-creators/create-body';
import { webApiModule } from '@/infrastructure/web-api/web-api.module';
import { IControllersState } from '@/lib/controller-tools/types/controllers-state.interface';
import { createChain } from '@/lib/controller-tools/decorator-creators/create-chain';
import { createController } from '@/lib/controller-tools/decorator-creators/create-controller';
import { createCookie } from '@/lib/controller-tools/decorator-creators/create-cookie';
import { createHandler } from '@/lib/controller-tools/decorator-creators/create-handler';
import { createHeader } from '@/lib/controller-tools/decorator-creators/create-header';
import { createParams } from '@/lib/controller-tools/decorator-creators/create-params';
import { createQuery } from '@/lib/controller-tools/decorator-creators/create-query';
import { createResponse } from '@/lib/controller-tools/decorator-creators/create-response';

webApiModule.init();

const controllersState = webApiModule.resolve<IControllersState>('controllersState');

export const Body = createBody(controllersState);
export const Chain = createChain(controllersState);
export const Controller = createController(controllersState);
export const Cookie = createCookie(controllersState);
export const Handler = createHandler(controllersState);
export const Header = createHeader(controllersState);
export const Params = createParams(controllersState);
export const Query = createQuery(controllersState);
export const Response = createResponse(controllersState);
