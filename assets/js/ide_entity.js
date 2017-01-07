// @flow

import Entity from './entity'
import type {Mode} from './engine'

export default class IdeEntity extends Entity {
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
