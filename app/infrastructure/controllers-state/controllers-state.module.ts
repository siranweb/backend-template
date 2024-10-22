import { Module } from '@/lib/module';
import { IControllersState } from '@/lib/controller-tools/types/controllers-state.interface';
import { ControllersState } from '@/lib/controller-tools/controllers-state';
import { IChainHandler } from '@/infrastructure/controllers-state/types/chain-handler.interface';
import { AuthChainHandler } from '@/infrastructure/controllers-state/chain-handlers/auth.chain-handler';
import { sharedModule } from '@/infrastructure/shared/shared.module';
import { usersModule } from '@/core/users/users.module';
import { Type } from 'di-wise';

export const controllersStateModule = new Module('controllersState');
controllersStateModule.import(sharedModule);
controllersStateModule.import(usersModule);

export const controllersStateModuleTokens = {
  authChainHandler: Type<IChainHandler>('authChainHandler'),
  controllersState: Type<IControllersState>('controllersState'),
};

controllersStateModule.register(controllersStateModuleTokens.authChainHandler, {
  useClass: AuthChainHandler,
});

controllersStateModule.register(controllersStateModuleTokens.controllersState, {
  useClass: ControllersState,
});
