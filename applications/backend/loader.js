import {existsSync} from 'node:fs'
import {basename, dirname, extname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

let extensions = ['js'], resolveDirs = true

let indexFiles = resolveDirs ? extensions.map(e => `index.${e}`) : []
let postfixes = extensions.map(e => `.${e}`).concat(indexFiles.map(p => `/${p}`))

function findPostfix(specifier, context) {
  const fileEndings = specifier.endsWith('/') ? indexFiles : postfixes;
  for (const fileEnding of fileEndings) {
    console.log(specifier + fileEnding);
    const isFound = existsSync(specifier.startsWith('/') ? specifier + fileEnding : join(dirname(fileURLToPath(context.parentURL)), specifier + fileEnding));
    if (isFound) return fileEnding;
  }
}

function findJsPostfix(specifier, isNpmLib) {
  return (specifier.endsWith('.js') || isNpmLib) ? '' : '.js';
}

let prefixes = ['/', './', '../']
export function resolve(specifier, context, nextResolve) {
  const isNpmLib = !prefixes.some(p => specifier.startsWith(p));
  console.log(prefixes.some(p => specifier.startsWith(p)));
  let postfix = prefixes.some(p => specifier.startsWith(p))
    && !extname(basename(specifier))
    && findPostfix(specifier, context)
    || findJsPostfix(specifier, isNpmLib);

  return nextResolve(specifier + postfix)
}