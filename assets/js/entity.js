// @flow

import Listener from './listener'
import State from './state'
import * as schema from './schema'
import type Component from './component'
import type Engine from './engine'
import type Scene from './scene'

export default class Entity {
  identity: number
  engine: Engine
  scene: ?Scene = null
  components: Component<any>[] = []

  add<P: Object>(c: Component<P>) {
    this.components.push(c)
  }

  constructor(engine: Engine) {
    this.identity = engine.newIdentity()
    this.engine = engine
    this.engine.addEntity(this)
  }

  maybeComponent<C>(cc: Class<C>): ?C {
    for(var i = 0; i <= this.components.length; i++) {
      const c = this.components[i]
      if ( c && c instanceof cc ){
        return c
      }
    }
  }

  component<C>(cc: Class<C>): C {
    const c = this.maybeComponent(cc)
    if (c) return c
    const x: any = cc
    throw new Error('Could not find component: ' + x.name)
  }

  listeners: Array<(e: Entity) => void> = []

  onUpdated(fn: (e: Entity) => void) {
    this.listeners.push(fn)
  }

  validate() {
    const errors = []
    for(var i = 0; i < this.components.length; i++) {
      errors.push(...this.components[i].validate())
    }
    return errors
  }
}
