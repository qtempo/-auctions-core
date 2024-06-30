import * as tsConfigPaths from 'tsconfig-paths'
import * as tsNodeEsm from 'ts-node/esm'
import { pathToFileURL } from 'node:url'

export function resolve(specifier, ctx, defaultResolve) {
  const { absoluteBaseUrl, paths } = tsConfigPaths.loadConfig()
  const matchPath = tsConfigPaths.createMatchPath(absoluteBaseUrl, paths)
  const match = matchPath(specifier)

  return match
    ? tsNodeEsm.resolve(pathToFileURL(`${match}`).href, ctx, defaultResolve)
    : tsNodeEsm.resolve(specifier, ctx, defaultResolve)
}

export { load, transformSource } from 'ts-node/esm'
