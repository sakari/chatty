// @flow

import * as schema from '../schema'
import Entity from '../entity'
import Component from '../component'

export default class Translation extends Component<{
  x: number,
  y: number,
  z: number,
  rotation: number
}> {

  static schema = new schema.Tree([
    { x: new schema.Number },
    { y: new schema.Number },
    { z: new schema.Number },
    { rotation: new schema.Number }
  ])

  constructor(e: Entity) {
    super(e, { x: 0, y: 0, z: 0, rotation: 0})
  }
}


