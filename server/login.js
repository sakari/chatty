// @flow

import Bcrypt from 'bcrypt'
import Hapi from 'hapi'
import boom from 'boom'
import User from './models/user'
import Session from './session'
import crypto from 'crypto'
import p from './p'

function errorHandler(handler) {
  return function(request, reply) {
    handler(request, reply).catch(e => reply(boom.wrap(e)))
  }
}

const signupHandler = errorHandler(async function(request, reply) {
  if (request.auth.isAuthenticated) {
    if (request.method === 'get') {
      return reply.redirect('/')
    }
    return reply(boom.conflict())
  }

  if (request.method === 'get')
    return reply.view('Default')

  const hash = await p(Bcrypt.hash, request.payload.password, 10)
  const user = await new User({email: request.payload.email, password_hash: hash }).save()
  const session = await Session.createForUser(user)
  request.cookieAuth.set({token: session.get('token')})
  reply({})
})

const loginHandler = errorHandler(async function(request, reply) {
  if (request.auth.isAuthenticated) {
    if (request.method === 'get') {
      return reply.redirect('/')
    }
    return reply(boom.conflict())
  }

  if (request.method === 'get')
    return reply.view('Default')

  const email = request.payload.email
  const user = await User.where({email}).fetch()
  if (!user)
    return reply(boom.notFound())
  if (!await p(Bcrypt.compare, request.payload.password, user.get('password_hash')))
    return reply(boom.notFound())
  const session = await Session.createForUser(user)
  request.cookieAuth.set({token: session.get('token')})
  reply({})
})

export default function login(server: Hapi.Server ) {

  server.route({
    path: '/signup',
    method: ['get', 'post'],
    config: {
      auth: { strategies: ['session'], mode: 'try' },
      plugins: { 'hapi-auth-cookie': { redirectTo: false }},
      handler: signupHandler
    }
  })

  server.route({
    path: '/login',
    method: ['get', 'post'],
    config: {
      auth: { strategies: ['session'], mode: 'try' },
      plugins: { 'hapi-auth-cookie': { redirectTo: false }},
      handler: loginHandler
    }
  })
}
