// @flow

import Engine from './engine'
import Entity from './entity'
import type {Mode} from './engine'
import Translation from './components/translation'
import Lock from './components/lock'

export default class IdeEntity extends Entity {
  pair: Entity

  constructor(engine: Engine, pair: Entity) {
    super(engine)
    this.pair = pair
    new Translation(this)
    new Lock(this, { to: this.pair })
  }

  engineModeChange(mode: Mode) {
    switch (mode) {
      case 'play':
        this.mode.set('disabled')
        break
      case 'edit':
        this.mode.set('running')
        break
      case 'pause':
        this.mode.set('paused')
        break
    }
  }
}
