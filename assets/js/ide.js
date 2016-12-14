// @flow
import React from 'react'
import {render} from './react'
import * as entity from './entity'

export default class Ide extends React.Component {
  state: {
    e: entity.Thing,
    engine: entity.Engine
  }
  constructor() {
    super()
    const engine = new entity.Engine()
    this.state = {engine: engine, e: new entity.Thing(engine) }
    this.state.e.onUpdated(() => this.forceUpdate())
  }

  render() {
    const rs = [this.state.e.component(entity.Render)]
    return render(rs)
  }
}
