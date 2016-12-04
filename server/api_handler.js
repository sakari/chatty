// @flow

import type {Server} from './hapi'
import boom from 'boom'
import User from './models/user'
import * as api from './api'
import apiRoute from './api_route'


//const postMessageHandler = async function(request, reply) {
  //const message = await new Message({
    //text: request.payload.text,
    //group: 'group ' + request.auth.credentials.get('id')
  //}).save()
  //reply({
    //text: message.get('text'),
    //group: message.get('group'),
    //id: message.get('id')
  //})
//}

export default function apiHandler(server: Server ) {

  const settings = {
    plugins: { 'hapi-auth-cookie': { redirectTo: false } }
  }

  //apiRoute(server, api.postMessage, {
    //...settings,
    //handler: postMessageHandler
  //})

}
