// @flow

import Translation from './translation'
import Entity from '../entity'
import Component from '../component'
import * as schema from '../schema'

export default class Lock extends Component<{
  to: Entity
}> {
  static schema = new schema.Tree([
    { to: new schema.InstanceOf(Entity) }
  ])

  constructor(e: Entity, opts: { to: Entity }) {
    super(e, opts)
    this.setLock(this.props.to)
  }

  setLock(to: Entity) {
    if (this.locked) {
    }
  }

  set(props: $Supertype<{to: Entity}>) {

  }
}
