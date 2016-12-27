// @flow
//
import Entity from '../entity'
import Component from '../component'
import Draw from '../draw'
import Container from './container'
import Render from './render'

export default class ContainerRender extends Render<{}> {
  constructor(e: Entity) {
    super(e, {})
  }

  render(draw: Draw) {
    draw.scene(this.entity, 600, 600, this.entity.component(Container).components(Render))
  }
}


