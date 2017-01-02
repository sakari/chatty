// @flow

import test from 'ava'
import Engine from './engine'
import Entity from './entity'
import Component from './component'
import Translation from './components/translation'

function setup() {
  const engine = new Engine
  const entity = new Entity(engine)
  const entity2 = new Entity(engine)
  const component = new Translation(entity)
  return {
    engine, entity2, entity, component
  }
}

test('maybeComponent finds component', t => {
  const { component, entity } = setup()
  t.is(component, entity.maybeComponent(Translation))
})

test('has identity', t => {
  const { entity, entity2 } = setup()
  t.not(entity.identity, entity2.identity)
})

test('entity has mode', t => {
  const { entity, engine } = setup()

  engine.play()
  t.is(entity.mode.value, 'running')

  engine.edit()
  t.is(entity.mode.value, 'paused')
})

test('lifecycly events go through', t => {
  const { entity, engine } = setup()
  let gotRun = 0, gotPause = 0
  class C extends Component {
    run() {
      gotRun++
    }
    pause() {
      gotPause++
    }
  }
  new C(entity, {})

  t.is(gotRun, 0)
  t.is(gotPause, 0)

  engine.play()
  t.is(gotRun, 1)
  t.is(gotPause, 0)

  engine.edit()
  t.is(gotRun, 1)
  t.is(gotPause, 1)

  engine.edit()
  t.is(gotRun, 1)
  t.is(gotPause, 1)

  engine.play()
  t.is(gotRun, 2)
  t.is(gotPause, 1)

  engine.play()
  t.is(gotRun, 2)
  t.is(gotPause, 1)
})
