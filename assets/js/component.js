// @flow

import type Entity from './entity'
import * as schema from './schema'

export default class Component<Props: Object> {
  entity: Entity

  static schema: schema.Prop = new schema.Obj
  props: Props

  constructor(e: Entity, props: Props) {
    this.entity = e
    this.props = props
    e.add(this)
  }

  component<C>(cc: Class<C>): C {
    return this.entity.component(cc)
  }

  name(): string {
    return this.constructor.name
  }

  run() {
    this.entity.listeners.trigger(this.entity)
  }

  pause() {
    this.entity.listeners.trigger(this.entity)
  }

  disabled() {
    this.entity.listeners.trigger(this.entity)
  }

  set(props: $Supertype<Props>) {
    this.props = {...this.props, ...props }
    this.entity.listeners.trigger(this.entity)
  }

  validate() {
    const c = this.constructor
    if (c) {
      return c.schema.validate(this.props)
    }
    return []
  }

  update() {}
}


