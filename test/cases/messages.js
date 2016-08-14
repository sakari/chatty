// @flow

import test from 'ava'
import * as api from '../../server/api'
import Session from '../session'
import {Range} from 'immutable'

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

test('fetch messages before', async t => {
  const test = new Session()
  await test.whileLoggedIn()
  const posted = []
  for(var i = 0; i < 100; i++) {
    posted.unshift(await test.api(api.postMessage, undefined, { text: `msg ${i}` }))
  }
  const reply = await test.api(api.messages, { before: posted[5].id, limit: 10 })
  t.deepEqual({ messages: posted.slice(6, 16)}, reply)
})

test('post messages', async t => {
  const test = new Session()
  await test.whileLoggedIn()
  const newMessage = await test.api(api.postMessage, undefined, {text: 'new message'})
  t.true(newMessage.text === 'new message')
  const messages = await test.api(api.messages)
  t.deepEqual([newMessage], messages.messages)
})

test('messages are not visible to other users', async t => {
  const test = new Session()
  await test.whileLoggedIn()
  await test.api(api.postMessage, undefined, {text: 'nnnnn'})

  const other = new Session()
  await other.whileLoggedIn()
  t.deepEqual([], (await other.api(api.messages)).messages)
})

