// @flow

import React from 'react'
import {render} from './react'
import {Engine, Scene, Thing} from './entity'

export default class Ide extends React.Component {
  state: {
    engine: Engine
  }
  constructor() {
    super()
    const engine = new Engine()
    const scene = new Scene(engine)
    const thing = new Thing(engine)
    scene.addEntity(thing)
    console.log(thing.validate())
    this.state = {engine: engine}
  }

  render() {
    return render(this.state.engine)
  }
}
