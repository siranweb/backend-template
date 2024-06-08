import { defineEventHandler, handleCors, Router } from 'h3';
import {
  usersController,
  exampleController,
  apiControllerInitializer,
} from '@/infrastructure/web-server/di';

export function initApiRouter(apiRouter: Router) {
  apiControllerInitializer.init(usersController).init(exampleController);

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
}
