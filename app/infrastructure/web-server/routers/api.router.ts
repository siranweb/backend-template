import { createRouter, defineEventHandler, handleCors } from 'h3';
import { exampleController } from '@/di/example.di';
import { usersController } from '@/di/users.di';
import { registerController } from '@/infrastructure/web-server/controller-definitions/register-controller';

export const apiRouter = createRouter();

registerController(apiRouter, exampleController);
registerController(apiRouter, usersController);

apiRouter.use(
  '/**',
  defineEventHandler(async (event) => {
    handleCors(event, {
      origin: '*',
      preflight: {
        statusCode: 204,
      },
      methods: '*',
    });
  }),
);
