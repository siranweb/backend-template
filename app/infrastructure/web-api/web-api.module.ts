import { Type } from 'di-wise';
import { Module } from '@/lib/module';
import { Controller } from '@/common/types/controller.types';
import { UsersController } from '@/api/users/users.controller';
import { ExampleController } from '@/api/example/example.controller';
import { sharedModule } from '@/infrastructure/shared/shared.module';
import { usersModule } from '@/core/users/users.module';
import { controllersStateModule } from '@/infrastructure/controllers-state/controllers-state.module';

export const webApiModule = new Module('webApi');
webApiModule.import(sharedModule);
webApiModule.import(controllersStateModule);
webApiModule.import(usersModule);

export const webApiModuleTokens = {
  usersController: Type<Controller>('usersController'),
  exampleController: Type<Controller>('exampleController'),
};

webApiModule.register(webApiModuleTokens.usersController, { useClass: UsersController });
webApiModule.register(webApiModuleTokens.exampleController, { useClass: ExampleController });
