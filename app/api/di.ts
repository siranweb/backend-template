import { asClass } from 'awilix';
import { appDi } from '@/infrastructure/ioc-container';
import { UsersController } from '@/api/users/controller';
import { ExampleController } from '@/api/example/controller';

appDi.register({
  usersController: asClass(UsersController).singleton(),
  exampleController: asClass(ExampleController).singleton(),
});
