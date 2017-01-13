// @flow

import Entity from './entity'
import Render from './components/render'

export type Color = string

export type Stroke = {
  color: Color,
  opacity: number,
  width: number,
  linecap: 'butt' | 'square' | 'round'
}

export type Fill = {
  color: Color,
  opacity: number
}

export default class Draw {
  +scene: (e: Entity, width: number, height: number, children: Array<Render<*>>) => void;
  +rect: (e: Entity, x: number, y: number, width: number, height: number, stroke: Stroke, fill: Fill) => void;
}


