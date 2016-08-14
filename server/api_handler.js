// @flow

import type {Server} from './hapi'
import boom from 'boom'
import User from './models/user'
import Message from './models/message'
import * as api from './api'
import apiRoute from './api_route'

const messagesHandler = async function(request, reply) {
  const messages = await Message.collection().query(qb => {
    qb.where({ group: 'group ' + request.auth.credentials.get('id')})
    const query = request.query
    if (query) {
      const {before, limit} = query
      if (before) {
        qb.where('id', '<', Number(query.before))
      }
      if (limit) {
        qb.limit(Number(query.limit))
        qb.orderBy('id', 'desc')
      }
    }
  }).fetch()
  reply({ messages: messages.map(m => ({
     id: m.get('id'),
     text: m.get('text'),
     group: m.get('group')
  }))})
}

const postMessageHandler = async function(request, reply) {
  const message = await new Message({
    text: request.payload.text,
    group: 'group ' + request.auth.credentials.get('id')
  }).save()
  reply({
    text: message.get('text'),
    group: message.get('group'),
    id: message.get('id')
  })
}

export default function apiHandler(server: Server ) {

  const settings = {
    plugins: { 'hapi-auth-cookie': { redirectTo: false } }
  }

  apiRoute(server, api.messages, {
    ...settings,
    handler: messagesHandler
  })

  apiRoute(server, api.postMessage, {
    ...settings,
    handler: postMessageHandler
  })

}
