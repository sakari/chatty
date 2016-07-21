// @flow

import hapi from 'hapi'
type Method = 'get' | 'post' | 'put' | 'delete'

export type Request<In> = {
  auth: { isAuthenticated: boolean },
  method: Method,
  payload: In,
  cookieAuth: {
    set: (session: {}) => void
  }
}

export type Reply<Out> = {
  reppy: Out,
  (m: (Out | Error)) : any,
  view(view: string): any,
  redirect(to: string): any
}

export type Handler<In, Out> = (request: Request<In>, reply: Reply<Out>) => Promise<mixed>

export type RouteConfig<In, Out> = {
  auth?: boolean | { strategies?: Array<string>, mode: 'try' },
  plugins?: { [plugin: string] : {}},
  handler: Handler<In, Out>
}

export type Route<In, Out> = {
  path: string,
  method: Method | Array<Method>,
  config?: RouteConfig<In, Out>
}

class ServerFlow {
  constructor(config?: {
    debug?: {
      request?: Array<string>,
      server?: Array<string>
    }
  }) { throw new Error('dont make these plz') };
  auth: any;
  route(route: Route<*, *>) {};
  connection: any;
  state: any;
  register: any;
  views: any;
  start: any;
  log(tags: Array<string>, message: any, timestamp?: Date) {};
}

export const Server : Class<ServerFlow> = hapi.Server
