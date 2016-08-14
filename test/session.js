// @flow

import * as api from '../server/api'
import request from 'request-promise-native'
import {Map, List} from 'immutable'

export default class Test {
  crumb: ?string
  jar: any
  email: string
  password: string

  constructor() {
    const i = Math.floor(Math.random() * 1000 * 1000)
    this.email = `${i}@example.com`
    this.password = `hunter${i}`
    this.jar = request.jar()
    this.crumb = null
  }

  clear() {
    this.jar = request.jar()
  }

  opts() {
    return { jar: this.jar, resolveWithFullResponse: true }
  }

  cookie(key: string, path: string = '') {
    return this.jar.getCookies(`http://localhost:8000${path}`)
      .map(c => c.toJSON())
      .filter( c => c.key === key)[0].value
  }

  getCrumb() {
    if (this.crumb)
      return this.crumb
    throw new Error('missing crumb')
  }

  async api<queryt, payloadt, out>(api: api.Api<queryt, payloadt, out>, query: queryt, body: payloadt): Promise<out> {
    const queryStr = Map(query || {})
      .reduce((reduction, value, key) => reduction.push(encodeURIComponent(key) + '=' + encodeURIComponent(value)), List())
      .join('&')

    const urlWithQuery = api.path + (queryStr === '' ? '' : ('?' + queryStr))
    const opts = {
      ...this.opts(),
      resolveWithFullResponse: false,
      headers: this.crumb ? { 'x-csrf-token': this.crumb } : {},
      method: api.method,
      json: true,
      body: body
    }
   return await request(`http://localhost:8000${urlWithQuery}`, opts)
  }

  async get(path : string = '') {
    const reply = await request(`http://localhost:8000${path}`, this.opts())

    const match = reply.body.match(/<meta content="([^"]+)"/)
    if (!match || !match[1]) {
      throw new Error('failed')
    }
    this.crumb = match[1]
    return reply
  }

  async whileLoggedIn() {
    await this.get('/signup')
    await this.api(api.signup, undefined, { email: this.email, password: this.password})
  }

  async withUser() {
    await this.whileLoggedIn()
    this.clear()
  }
}

