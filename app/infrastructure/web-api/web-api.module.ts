import { Module } from '@/lib/module';
import { asClass } from 'awilix';
import { Controller } from '@/common/types/controller.types';
import { UsersController } from '@/api/users/users.controller';
import { ExampleController } from '@/api/example/example.controller';
import { sharedModule } from '@/infrastructure/shared/shared.module';
import { usersModule } from '@/core/users/users.module';

export const webApiModule = new Module('webApi');
webApiModule.use(sharedModule);
webApiModule.use(usersModule);

webApiModule.register<Controller>('usersController', asClass(UsersController).singleton());
webApiModule.register<Controller>('exampleController', asClass(ExampleController).singleton());
