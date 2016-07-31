// @flow

import * as hapi from './lib/hapi'
import User from './models/user'
export type Auth = User
export type Server = hapi.Server<Auth>
export type RouteConfig<I, O> = hapi.RouteConfig<I, O, Auth>
export type FunctionHandler<I, O> = hapi.FunctionHandler<I, O, Auth>
export type Handler<I, O> = hapi.Handler<I, O, Auth>
export type Request<I> = hapi.Request<I, Auth>
export type Reply<O> = hapi.Reply<O, Auth>
