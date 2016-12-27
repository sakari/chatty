// @flow

import test from 'ava'
import Engine from './engine'
import Entity from './entity'
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
