// @flow

import Mouse from './components/mouse'
import Container from './components/container'
import ContainerRender from './components/container_render'
import type Engine from './engine'
import Entity from './entity'

export default class Scene extends Entity {
  constructor(e: Engine) {
    super(e)
    new Mouse(this)
    new Container(this)
    new ContainerRender(this)
  }

  addEntity(e: Entity) {
    this.component(Container).addEntity(e)
    e.scene = this
  }
}

