// @flow
import type Entity from './entity'
import State from './state'
import Scene from './scene'

export type Mode = 'play' | 'edit' | 'paused'
export default class Engine {
  identifiers: number = 0
  entities: Array<Entity> = []
  mode: State<Mode> = new State('paused')

  constructor() {
    this.mode.listen.on(this, this.modeChanged)
  }

  modeChanged() {
    for (var i = 0; i < this.entities.length; i++) {
      this.entities[i].engineModeChange(this.mode.value)
    }
  }

  newIdentity() {
    return this.identifiers++
  }

  play() {
    this.mode.set('play')
  }

  edit() {
    this.mode.set('edit')
  }

  scenes() : Array<Scene> {
    const memo = []
    for(var i = 0; i < this.entities.length; i++) {
      const e = this.entities[i]
      if (e instanceof Scene) {
        memo.push(e)
      }
    }
    return memo
  }

  addEntity(entity: Entity) {
    this.entities.push(entity)
  }
}

