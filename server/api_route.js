// @flow
import type {Server, RouteConfig, FunctionHandler, Request, Reply} from './hapi'
import * as api from './api'
import boom from 'boom'

type Config<query, payload, out> = {
  auth?: boolean | { strategies?: Array<string>, mode: 'try' },
  plugins?: { [plugin: string] : {}},
  handler: FunctionHandler<query, payload, out>
}

export default function apiRoute<query, payload, out>(
  server: Server,
  api: api.Api<query, payload, out>,
  config: Config<query, payload, out>) {

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


