// @flow

import hapi from 'hapi'
type Method = 'get' | 'post' | 'put' | 'delete'

export type Request<In, Auth> = {
  auth: { isAuthenticated: boolean, credentials: Auth },
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

export type StaticHandler = { directory: { path: string, index: Array<string> }}
export type ViewHandler = { view: string }
export type FunctionHandler<In, Out, Auth> = (request: Request<In, Auth>, reply: Reply<Out>) => Promise<mixed>

export type Handler<In, Out, Auth>
  = FunctionHandler<In, Out, Auth>
  | StaticHandler
  | ViewHandler

export type RouteConfig<In, Out, Auth> = {
  auth?: boolean | { strategies?: Array<string>, mode: 'try' },
  plugins?: { [plugin: string] : {}},
  handler: Handler<In, Out, Auth>
}

export type Route<In, Out, Auth> = {
  path: string,
  method: Method | Array<Method>,
  config?: RouteConfig<In, Out, Auth>
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
  route(route: Route<*, *, Auth>) {};
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
