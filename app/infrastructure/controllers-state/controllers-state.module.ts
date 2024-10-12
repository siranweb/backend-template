import { Module } from '@/lib/module';
import { IControllersState } from '@/lib/controller-tools/types/controllers-state.interface';
import { asClass } from 'awilix';
import { ControllersState } from '@/lib/controller-tools/controllers-state';
import { IChainHandler } from '@/infrastructure/controllers-state/types/chain-handler.interface';
import { AuthChainHandler } from '@/infrastructure/controllers-state/chain-handlers/auth.chain-handler';
import { sharedModule } from '@/infrastructure/shared/shared.module';
import { usersModule } from '@/core/users/users.module';

export const controllersStateModule = new Module('controllersState');
controllersStateModule.use(sharedModule);
controllersStateModule.use(usersModule);

controllersStateModule.register<IChainHandler>(
  'authChainHandler',
  asClass(AuthChainHandler).singleton(),
);

controllersStateModule.register<IControllersState>(
  'controllersState',
  asClass(ControllersState).singleton(),
);
