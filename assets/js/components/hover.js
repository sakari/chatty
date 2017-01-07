// @flow

import Component from '../component'
import Mouse from './mouse'
import Entity from '../entity'
import State from '../state'

export default class Hover extends Component<{}> {
  hover: State<'on' | 'off'> =
    new State('off')

  constructor(e: Entity) {
    super(e, {})
    const mouse = this.entity.component(Mouse)
    mouse.onMouseEnter.on(this, this.hoverStart)
    mouse.onMouseLeave.on(this, this.hoverEnd)
  }

  hoverStart() {
    this.hover.set('on')
  }

  hoverEnd() {
    this.hover.set('off')
  }
}
