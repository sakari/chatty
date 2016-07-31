// @flow
import type {RouteConfig, Handler, Request, Reply} from './lib/hapi'
import {Server} from './lib/hapi'
import * as api from './api'
import boom from 'boom'

export default function apiRoute<In, Out>(
  server: Server,
  api: api.Api<In, Out>,
  routeConfig: RouteConfig<In, Out>) {

  const handler : any = function(req, res) {
    return routeConfig.handler(req, res).catch(e => res(boom.wrap(e)))
  }

  server.route({
    path: api.path,
    method: api.method,
    config: {...routeConfig, handler }
  })
}


