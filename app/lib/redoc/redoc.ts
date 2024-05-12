import { IRedoc, Options } from './types/redoc.interface';
import { html } from '@/lib/redoc/template';

export class Redoc implements IRedoc {
  make(options: Options): string {
    return html
      .replace('[[title]]', options.title)
      .replace('[[spec]]', JSON.stringify(options.spec));
  }
}
