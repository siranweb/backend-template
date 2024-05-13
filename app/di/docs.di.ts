import { DocsController } from '@/modules/api/docs/docs.controller';
import { redoc } from '@/di/web-server.di';

export const docsController = new DocsController(redoc);
