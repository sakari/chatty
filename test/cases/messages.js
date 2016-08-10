// @flow

import test from 'ava'
import * as api from '../../server/api'
import Session from '../session'

test('fails when not logged in', async t => {
  const test = new Session()
  t.plan(1)
  await test.api(api.messages)
    .catch(e => t.is(401, e.statusCode))
})

test('fetch all messages', async t => {
  const test = new Session()
  await test.whileLoggedIn()
  const reply = await test.api(api.messages)
  t.deepEqual({messages: []}, reply)
})

test('post messages', async t => {
  const test = new Session()
  await test.whileLoggedIn()
  const newMessage = await test.api(api.postMessage, {text: 'new message'})
  const messages = await test.api(api.messages)
  t.deepEqual([newMessage], messages.messages)
})

test('messages are not visible to other users', async t => {
  const test = new Session()
  await test.whileLoggedIn()
  await test.api(api.postMessage, {text: 'nnnnn'})

  const other = new Session()
  await other.whileLoggedIn()
  t.deepEqual([], (await other.api(api.messages)).messages)
})

