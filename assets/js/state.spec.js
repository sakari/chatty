// @flow

import test from 'ava'
import State from './state'

test('set notifies listeners', async t => {
  const state = new State(1)
  const p = new Promise((ok, err) => {
    state.listen.on({}, ok)
  }).then(v => t.is(v, 10))
  state.set(10)
  p
})
