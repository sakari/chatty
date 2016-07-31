// @flow

import Bcrypt from 'bcrypt'
import type {Server, RouteConfig, Handler, Request, Reply} from './hapi'
import boom from 'boom'
import User from './models/user'
import Session from './session'
import crypto from 'crypto'
import p from './p'
import * as api from './api'
import apiRoute from './api_route'

function errorHandler(handler) {
  return function(request, reply) {
    return handler(request, reply).catch(e => reply(boom.wrap(e)))
  }
}

const signupHandler = errorHandler(async function(request, reply) {
  if (request.auth.isAuthenticated) {
    return reply.redirect('/')
  }

  return reply.view('Default')
})

const apiSignupHandler = async function(request, reply) {
  if (request.auth.isAuthenticated) {
    return reply(boom.conflict())
  }

  const hash = await p(Bcrypt.hash, request.payload.password, 10)
  const user = await new User({email: request.payload.email, password_hash: hash }).save()
  const session = await Session.createForUser(user)
  request.cookieAuth.set({token: session.get('token')})
  reply({})
}

const loginHandler = errorHandler(async function(request, reply) {
  if (request.auth.isAuthenticated) {
    return reply.redirect('/')
  }
  return reply.view('Default')
})

const apiLoginHandler = async function(request, reply) {
  if (request.auth.isAuthenticated) {
    return reply(boom.conflict())
  }

  const email = request.payload.email
  const user = await User.where({email}).fetch()
  if (!user)
    return reply(boom.notFound())
  if (!await p(Bcrypt.compare, request.payload.password, user.get('password_hash')))
    return reply(boom.notFound())
  const session = await Session.createForUser(user)
  request.cookieAuth.set({token: session.get('token')})
  reply({})
}

export default function login(server: Server ) {
  server.route({
    path: '/signup',
    method: 'get',
    config: {
      auth: { strategies: ['session'], mode: 'try' },
      plugins: { 'hapi-auth-cookie': { redirectTo: false }},
      handler: signupHandler
    }
  })

  server.route({
    path: '/login',
    method: 'get',
    config: {
      auth: { strategies: ['session'], mode: 'try' },
      plugins: { 'hapi-auth-cookie': { redirectTo: false }},
      handler: loginHandler
    }
  })

  apiRoute(server, api.signup, {
    auth: { strategies: ['session'], mode: 'try' },
    plugins: { 'hapi-auth-cookie': { redirectTo: false }},
    handler: apiSignupHandler
  })

  apiRoute(server, api.login, {
    auth: { strategies: ['session'], mode: 'try' },
    plugins: { 'hapi-auth-cookie': { redirectTo: false }},
    handler: apiLoginHandler
  })
}
