// @flow

import Engine from './engine'
import type Ide from './ide'
import Entity from './entity'
import type {Mode} from './engine'
import Translation from './components/translation'
import Lock from './components/lock'

export default class IdeEntity extends Entity {
  pair: Entity
  ide: Ide

  constructor(engine: Engine, ide: Ide, pair: Entity) {
    super(engine)
    this.pair = pair
    this.ide = ide
    new Translation(this)
    new Lock(this, { to: this.pair })
  }

  getMode() {
    const mode = this.engine.mode.value
    switch(mode) {
      case 'play':
        return 'disabled'
      case 'edit':
        return 'running'
      case 'pause':
        return 'paused'
    }
    return 'paused'
  }

  updateMode() {
    this.mode.set(this.getMode())
  }
}
