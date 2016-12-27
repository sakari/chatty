// @flow

import Entity from './entity'
import Render from './components/render'

export default class Draw {
  +scene: (e: Entity, width: number, height: number, children: Array<Render<*>>) => void;
  +rect: (e: Entity, x: number, y: number, width: number, height: number) => void;
}


