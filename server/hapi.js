// @flow

import * as hapi from './lib/hapi'
import User from './models/user'
export type Auth = User
export type Server = hapi.Server<Auth>
export type RouteConfig<Q, I, O> = hapi.RouteConfig<Q, I, O, Auth>
export type FunctionHandler<Q, I, O> = hapi.FunctionHandler<Q, I, O, Auth>
export type Handler<Q, I, O> = hapi.Handler<Q, I, O, Auth>
export type Request<Q, I> = hapi.Request<Q, I, Auth>
export type Reply<O> = hapi.Reply<O, Auth>
