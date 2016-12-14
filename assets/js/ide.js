// @flow
import React from 'react'
import {render} from './react'
import * as entity from './entity'

export default class Ide extends React.Component {
  state: {
    e: entity.Thing
  }
  constructor() {
    super()
    this.state = {e: new entity.Thing() }
    this.state.e.onUpdated(() => this.forceUpdate())
  }

  render() {
    const rs = [this.state.e.component(entity.Render)]
    return render(rs)
  }
}
