import { Module } from '@/lib/module';
import { asClass } from 'awilix';
import { AuthChainHandler } from '@/infrastructure/web-api/chain-handlers/auth.chain-handler';
import { IChainHandler } from '@/infrastructure/web-api/types/chain-handler.interface';
import { Controller } from '@/common/types/controller.types';
import { UsersController } from '@/api/users/users.controller';
import { ExampleController } from '@/api/example/example.controller';
import { sharedModule } from '@/infrastructure/shared/shared.module';
import { IControllersState } from '@/lib/controller-tools/types/controllers-state.interface';
import { ControllersState } from '@/lib/controller-tools/controllers-state';

export const webApiModule = new Module('webApi');
webApiModule.use(sharedModule);

webApiModule.register<IControllersState>('controllersState', asClass(ControllersState).singleton());
webApiModule.register<IChainHandler>('authChainHandler', asClass(AuthChainHandler).singleton());

webApiModule.register<Controller>('usersController', asClass(UsersController).singleton());
webApiModule.register<Controller>('exampleController', asClass(ExampleController).singleton());
