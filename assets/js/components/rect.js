// @flow
import Translation from './translation'
import Render from './render'
import Entity from '../entity'
import type Draw from '../draw'

export default class Rect extends Render<{}> {
  constructor(e: Entity) {
    super(e, {})
  }

  render(draw: Draw) {
    const t = this.component(Translation)
    draw.rect(this.entity, t.props.x, t.props.y, 20, 10)
  }
}


