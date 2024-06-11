import { createRouter, defineEventHandler, handleCors } from 'h3';

export function makeApiRouter() {
  const router = createRouter();

  router.use(
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

  return router;
}
