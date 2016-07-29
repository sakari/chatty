// @flow

import test from 'ava'
import request from 'request-promise-native'
import * as api from '../../server/api'

class Test {
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

  cookie(key, path='') {
    return this.jar.getCookies(`http://localhost:8000${path}`)
      .map(c => c.toJSON())
      .filter( c => c.key === key)[0].value
  }

  getCrumb() {
    if (this.crumb)
      return this.crumb
    throw new Error('missing crumb')
  }

  async api<In, Out>(api: api.Api<In, Out>, body?: In): Promise<Out> {
    const opts = {
      ...this.opts(),
      resolveWithFullResponse: false,
      headers: this.crumb ? { 'x-csrf-token': this.crumb } : {},
      method: api.method,
      json: true,
      body: body
    }
   return await request(`http://localhost:8000${api.path}`, opts)
  }

  async get(path = '') {
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
    await this.api(api.signup, { email: this.email, password: this.password})
  }

  async withUser() {
    await this.whileLoggedIn()
    this.clear()
  }
}

test('without session gets redirected to login with next query parameter', async t => {
  const test = new Test()
  const reply = await test.get('/somepage')
  t.is('http://localhost:8000/login?next=%2Fsomepage', reply.request.uri.href)
})

test('signup', async t => {
  const test = new Test()
  await test.get('/signup')
  t.is(test.crumb, test.cookie('crumb'))

  await test.api(api.signup, { email: test.email, password: test.password })
  t.is('/', (await test.get()).request.uri.path)
})

test('login', async t => {
  const test = new Test()
  await test.withUser()

  t.true(/\/login\?/.test((await test.get('/somepage')).request.uri.path))
  await test.api(api.login, { email: test.email, password: test.password})
  t.is('/somepage', (await test.get('/somepage')).request.uri.path)
})

test('login with incorrect user', async t => {
  const test = new Test()
  await test.withUser()

  await test.get('/login')
  t.plan(1)
  await test.api(api.login, { email: 'incorrect@example.com', password: test.password })
    .catch(e => t.is(404, e.statusCode))
})

test('login with incorrect password', async t => {
  const test = new Test()
  await test.withUser()

  await test.get('/login')
  t.plan(1)
  await test.api(api.login, { email: test.email, password: 'incorrect'})
    .catch(e => t.is(404, e.statusCode))
})

test('login with missing crumb', async t => {
  const test = new Test()
  await test.withUser()

  t.plan(1)
  test.crumb = undefined
  await test.api(api.login, { email: test.email, password: test.password })
    .catch(e => t.is(403, e.statusCode))
})

test('login with incorrect crumb', async t => {
  const test = new Test()
  await test.withUser()

  t.plan(1)
  test.crumb = test.getCrumb().replace(/./g, '1')
  await test.api(api.login, { email: test.email, password: test.password })
    .catch(e => t.is(403, e.statusCode))
})

test('getting login while logged in', async t => {
  const test = new Test()
  await test.whileLoggedIn()
  const reply = await test.get('/login')
  t.is('/', reply.request.uri.path)
})

test('getting signup while logged in redirects to /', async t => {
  const test = new Test()
  await test.whileLoggedIn()
  const reply = await test.get('/signup')
  t.is('/', reply.request.uri.path)
})

test('posting to login while logged in gives error', async t => {
  const test = new Test()
  await test.whileLoggedIn()
  t.plan(1)
  const reply = await test.api(api.login, { email: 'some@example.com', password: 'incorrect' })
    .catch(e => t.is(409, e.statusCode))
})

test('posting to signup while logged in gives error', async t => {
  const test = new Test()
  await test.whileLoggedIn()
  t.plan(1)
  const reply = await test.api(api.signup, { email: 'some@example.com', password: 'incorrect' })
    .catch(e => t.is(409, e.statusCode))
})

