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

  lockedTo: ?Entity

  constructor(e: Entity, opts: { to: Entity }) {
    super(e, opts)
    this.lockOn(this.props.to)
  }

  lockOn(to: Entity) {
    if (this.lockedTo) {
      this.lockedTo.listeners.off(this, this.track)
    }
    this.lockedTo = to
    to.listeners.on_(this, this.track)
  }

  track() {
    const t = this.props.to.component(Translation)
    this.entity.component(Translation).set(t.props)
  }

  set(props: $Supertype<{to: Entity}>) {
    this.lockOn(props.to)
    super.set(props)
  }
}
