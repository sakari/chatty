// @flow

import 'babel-polyfill'
import {Server} from './lib/hapi'
import inert from 'inert'
import vision from 'vision'
import crumb from 'crumb'

import hapiReactViews from 'hapi-react-views'
import * as env from './env'
import login from './login'
import api_handler from './api_handler'
import authBasic from 'hapi-auth-basic'
import authCookie from 'hapi-auth-cookie'
import User from './models/user'
import Session from './session'

const server = new Server({
  debug: { request: ['auth', 'error']}
})

server.connection({
  host: 'localhost',
  port: 8000
})

server.state('session', {
    ttl: 24 * 60 * 60 * 1000,
    isSecure: !env.development,
    path: '/',
    encoding: 'base64json'
});

server.register([
  inert, vision,
  { register: crumb, options: { restful: true }},
  authBasic, authCookie
], function(err) {

  if (err) return console.error(err);

  server.auth.strategy('session', 'cookie', true, {
    password: env.cookiePassword,
    cookie: 'sid',
    redirectTo: '/login',
    appendNext: true,
    isSecure: !env.development,
    validateFunc: (request, {token}, callback) => {
      request.log(['auth'], 'aaa ' + token)
      Session.where({token}).fetch({withRelated: ['user']})
        .then(session => {
          if (!session || !session.related('user')) {
            return callback(null, false)
          }
          callback(null, true, session.related('user'))
        })
        .catch(e => {
          request.log(['auth'], 'got error ' + e.toString())
          callback(e, false)
        })
    }
  })

  server.views({
    engines: {
      js: hapiReactViews
    },
    relativeTo: __dirname,
    path: 'views'
  })

  server.route({
    method: 'get',
    path: '/assets/{param*}',
    config: {
      auth: false,
      handler: {
        directory: {
          path: 'assets',
          index: ['index.html']
        }
      }
    }
  })

  login(server)
  api_handler(server)

  server.route({
    method: 'get',
    path: '/{path*}',
    handler: {
      view: 'Default'
    }
  })

  server.start(function() {
    console.log('server started')
  })
})
