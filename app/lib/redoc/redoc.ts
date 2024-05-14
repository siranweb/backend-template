import { html } from './template';
import { IRedoc, RouteParams, Spec } from './types/redoc.interface';
import { AvailableMethod } from './types/shared';
import { createDocument } from 'zod-openapi';

export class Redoc implements IRedoc {
  private readonly spec: Spec;

  constructor(title: string) {
    this.spec = {
      openapi: '3.1.0',
      info: {
        title,
        version: '',
      },
      paths: {},
      tags: [],
    };
  }

  public make(): string {
    const builtSpec = createDocument(this.spec);
    return html
      .replace('[[title]]', this.spec.info.title)
      .replace('[[spec]]', JSON.stringify(builtSpec));
  }

  public addPath(path: string, method: AvailableMethod, routeParams: RouteParams): void {
    if (!(path in this.spec.paths)) {
      this.spec.paths[path] = {};
    }
    const pathObj = this.spec.paths[path];

    pathObj[method] = {
      tags: routeParams.tags,
      summary: routeParams.summary,
      description: routeParams.description,
      // requestParams: routeParams.params,
      responses: {},
    };

    if (routeParams.body) {
      pathObj[method]!.requestBody = {
        content: {
          [routeParams.body.contentType ?? 'application/json']: {
            schema: routeParams.body.schema,
          },
        },
      };
    }
  }
}
