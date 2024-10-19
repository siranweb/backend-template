import path from 'node:path';
// @ts-ignore
globalThis.basePath = path.resolve('../../');

declare global {
  const basePath: string;
}
