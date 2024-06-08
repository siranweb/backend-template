import { defineEventHandler, Router, serveStatic } from 'h3';
import fsp from 'node:fs/promises';
import swaggerUiDist from 'swagger-ui-dist';
import path from 'node:path';
import { html } from '@/infrastructure/web-server/docs/swagger-template';
import { IOpenApi } from '@/infrastructure/web-server/types/open-api-builder.interface';

export function initDocsRouter(apiRouter: Router, openApi: IOpenApi) {
  apiRouter.use(
    '/docs',
    defineEventHandler(() => {
      return html;
    }),
  );

  apiRouter.use(
    '/open-api.json',
    defineEventHandler(() => {
      return openApi.build();
    }),
  );

  apiRouter.use(
    '/docs/**',
    defineEventHandler((event) => {
      return serveStatic(event, {
        getContents: async (id) => {
          return fsp.readFile(path.join(swaggerUiDist.absolutePath(), id.replace('/docs', '')));
        },
        getMeta: async (id) => {
          const stats = await fsp
            .stat(path.join(swaggerUiDist.absolutePath(), id.replace('/docs', '')))
            .catch(() => {});
          if (!stats || !stats.isFile()) {
            return;
          }

          let type: string | undefined;
          if (id.endsWith('.js')) {
            type = 'text/javascript';
          } else if (id.endsWith('.css')) {
            type = 'text/css';
          }

          return {
            size: stats.size,
            mtime: stats.mtimeMs,
            type,
          };
        },
      });
    }),
  );
}
