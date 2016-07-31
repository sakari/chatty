// @flow
import type {Server, RouteConfig, FunctionHandler, Request, Reply} from './hapi'
import * as api from './api'
import boom from 'boom'

type Config<In, Out> = {
  auth?: boolean | { strategies?: Array<string>, mode: 'try' },
  plugins?: { [plugin: string] : {}},
  handler: FunctionHandler<In, Out>
}

export default function apiRoute<In, Out>(
  server: Server,
  api: api.Api<In, Out>,
  config: Config<In, Out>) {

  const handler : any = function(req, res) {
      return config.handler(req, res).catch(e => res(boom.wrap(e)))
  }

  const auth = config.auth
  const plugins = config.plugins

  server.route({
    path: api.path,
    method: api.method,
    config: { auth, plugins, handler }
  })
}


