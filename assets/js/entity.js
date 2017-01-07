// @flow

import Listener from './listener'
import State from './state'
import * as schema from './schema'
import type Component from './component'
import type Engine, {Mode} from './engine'
import type Scene from './scene'

export default class Entity {
  identity: number
  engine: Engine
  scene: ?Scene = null
  components: Component<any>[] = []
  mode: State<'running' | 'paused' | 'disabled'> = new State('paused')

  listeners : Listener<Entity> = new Listener()

  add<P: Object>(c: Component<P>) {
    this.components.push(c)
  }

  engineModeChange(mode: Mode) {
    switch (mode) {
      case 'play':
        this.mode.set('running')
        break;
      case 'edit':
      case 'pause':
        this.mode.set('paused')
        break;
    }
  }

  constructor(engine: Engine) {
    this.identity = engine.newIdentity()
    this.engine = engine
    this.engine.addEntity(this)
    this.mode.listen.on(this, this.modeChange)
  }

  modeChange() {
    if (this.mode.value === 'running') {
      this.components.forEach(component => component.run())
    } else if (this.mode.value === 'paused') {
      this.components.forEach(component => component.pause())
    } else if (this.mode.value === 'disabled') {
      this.components.forEach(component => component.disabled())
    }
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

  validate() {
    const errors = []
    for(var i = 0; i < this.components.length; i++) {
      errors.push(...this.components[i].validate())
    }
    return errors
  }
}
