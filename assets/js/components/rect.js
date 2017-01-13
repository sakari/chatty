// @flow
import Translation from './translation'
import Render from './render'
import * as schema  from '../schema'
import Entity from '../entity'
import type Draw, {Stroke, Fill} from '../draw'

export default class Rect extends Render<{
  width: number, height: number,
  fill: Fill, stroke: Stroke
}> {
  static schema = new schema.Tree([
    {width: new schema.Number},
    {height: new schema.Number},
    {fill: new schema.Fill},
    {stroke: new schema.Stroke}
  ])

  render(draw: Draw) {
    const t = this.component(Translation)
    draw.rect(this.entity, t.props.x, t.props.y,
      this.props.width,
      this.props.height,
      this.props.stroke,
      this.props.fill
    )
  }
}


