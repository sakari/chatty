// @flow
import Mouse from './mouse'
import type {MouseEvent} from './mouse'
import Translation from './translation'
import Component from '../component'
import Entity from '../entity'

export default class Drag extends Component<{}> {
  state: 'up' | 'down'

  constructor(e: Entity) {
    super(e, {})
    this.state = 'up'
  }

  pause() {
    this.up()
    const mouse = this.component(Mouse)
    mouse.onMouseDown.off(this, this.down)
    super.pause()
  }

  disabled() {
    this.pause()
  }

  run() {
    const mouse = this.component(Mouse)
    mouse.onMouseDown.on(this, this.down)
    super.run()
  }

  up() {
    const scene = this.entity.scene
    if (this.state !== 'up' && scene) {
      this.state = 'up'
      const mouse = scene.component(Mouse)
      mouse.onMouseUp.off(this)
      mouse.onMouseMove.off(this)
      mouse.onMouseLeave.off(this)
    }
  }

  down() {
    const scene = this.entity.scene
    if (this.state !== 'down' && scene) {
      this.state = 'down'
      const mouse = scene.component(Mouse)
      mouse.onMouseUp.on(this, this.up)
      mouse.onMouseMove.on(this, this.move)
      mouse.onMouseLeave.on(this, this.up)
    }
  }

  move(e: MouseEvent) {
    if (this.state === 'down') {
      const t = this.component(Translation)
      t.set({x: e.x, y: e.y })
    }
  }
}


