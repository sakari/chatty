// @flow

import Entity from '../entity'
import Component from '../component'
export default class Container extends Component<{}> {
  constructor(e: Entity) {
    super(e, {})
  }

  entities: Array<Entity> = []

  addEntity(e: Entity) {
    this.entities.push(e)
  }

  components<C>(cc: Class<C>): Array<C> {
    return this
      .entities
      .map(e => e.maybeComponent(cc))
      .reduce((m, c) => c ? [...m, c] : m, [])
  }
}


