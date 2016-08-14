// @flow

import hapi from 'hapi'
type Method = 'get' | 'post' | 'put' | 'delete'

export type Request<query, payload, auth> = {
  auth: { isAuthenticated: boolean, credentials: auth },
  method: Method,
  query: query,
  log: (scope: Array<string>, data: any) => void,
  payload: payload,
  cookieAuth: {
    set: (session: {}) => void
  }
}

export type Reply<out> = {
  reppy: out,
  (m: (out | Error)) : any,
  view(view: string): any,
  redirect(to: string): any
}

export type StaticHandler = { directory: { path: string, index: Array<string> }}
export type ViewHandler = { view: string }
export type FunctionHandler<query, payload, out, auth> = (request: Request<query, payload, auth>, reply: Reply<out>) => Promise<mixed>

export type Handler<query, payload, out, auth>
  = FunctionHandler<query, payload, out, auth>
  | StaticHandler
  | ViewHandler

export type RouteConfig<query, payload, out, auth> = {
  auth?: boolean | { strategies?: Array<string>, mode: 'try' },
  plugins?: { [plugin: string] : {}},
  handler: Handler<query, payload, out, auth>
}

export type Route<query, payload, out, auth> = {
  path: string,
  method: Method | Array<Method>,
  config?: RouteConfig<query, payload, out, auth>
}

type Opts = {
  debug?: {
    request?: Array<string>,
    server?: Array<string>
  }
}

export class Server<Auth> {
  constructor(config?: Opts) { throw new Error('dont make these plz') };
  auth: any;
  route(route: Route<*, *, *, Auth>) {};
  connection: any;
  state: any;
  register: any;
  views: any;
  start: any;
  log(tags: Array<string>, message: any, timestamp?: Date) {};
}

export function createServer<Auth>(opts?: Opts): Server<Auth> {
  return new hapi.Server(opts)
}
