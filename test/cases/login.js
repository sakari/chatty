// @flow

import test from 'ava'
import * as api from '../../server/api'
import Session from '../session'


test('without session gets redirected to login with next query parameter', async t => {
  const test = new Session()
  const reply = await test.get('/somepage')
  t.is('http://localhost:8000/login?next=%2Fsomepage', reply.request.uri.href)
})

test('signup', async t => {
  const test = new Session()
  await test.get('/signup')
  t.is(test.crumb, test.cookie('crumb'))

  await test.api(api.signup, { email: test.email, password: test.password })
  t.is('/', (await test.get()).request.uri.path)
})

test('login', async t => {
  const test = new Session()
  await test.withUser()

  t.true(/\/login\?/.test((await test.get('/somepage')).request.uri.path))
  await test.api(api.login, { email: test.email, password: test.password})
  t.is('/somepage', (await test.get('/somepage')).request.uri.path)
})

test('login with incorrect user', async t => {
  const test = new Session()
  await test.withUser()

  await test.get('/login')
  t.plan(1)
  await test.api(api.login, { email: 'incorrect@example.com', password: test.password })
    .catch(e => t.is(404, e.statusCode))
})

test('login with incorrect password', async t => {
  const test = new Session()
  await test.withUser()

  await test.get('/login')
  t.plan(1)
  await test.api(api.login, { email: test.email, password: 'incorrect'})
    .catch(e => t.is(404, e.statusCode))
})

test('login with missing crumb', async t => {
  const test = new Session()
  await test.withUser()

  t.plan(1)
  test.crumb = undefined
  await test.api(api.login, { email: test.email, password: test.password })
    .catch(e => t.is(403, e.statusCode))
})

test('login with incorrect crumb', async t => {
  const test = new Session()
  await test.withUser()

  t.plan(1)
  test.crumb = test.getCrumb().replace(/./g, '1')
  await test.api(api.login, { email: test.email, password: test.password })
    .catch(e => t.is(403, e.statusCode))
})

test('getting login while logged in', async t => {
  const test = new Session()
  await test.whileLoggedIn()
  const reply = await test.get('/login')
  t.is('/', reply.request.uri.path)
})

test('getting signup while logged in redirects to /', async t => {
  const test = new Session()
  await test.whileLoggedIn()
  const reply = await test.get('/signup')
  t.is('/', reply.request.uri.path)
})

test('posting to login while logged in gives error', async t => {
  const test = new Session()
  await test.whileLoggedIn()
  t.plan(1)
  const reply = await test.api(api.login, { email: 'some@example.com', password: 'incorrect' })
    .catch(e => t.is(409, e.statusCode))
})

test('posting to signup while logged in gives error', async t => {
  const test = new Session()
  await test.whileLoggedIn()
  t.plan(1)
  const reply = await test.api(api.signup, { email: 'some@example.com', password: 'incorrect' })
    .catch(e => t.is(409, e.statusCode))
})

