// @flow
import Component from '../component'
import Entity from '../entity'
import Listener from '../listener'

export type MouseEvent = { x : number, y: number}
type ClientMouseEvent = { x : number, y: number}
type MouseHandler = (e: MouseEvent) => void
export default class Mouse extends Component<{}> {
  onMouseDown: Listener<MouseEvent>
  onMouseUp: Listener<MouseEvent>
  onMouseMove: Listener<MouseEvent>
  onMouseLeave: Listener<MouseEvent>

  constructor(e: Entity) {
    super(e, {})
    this.onMouseDown = new Listener()
    this.onMouseUp = new Listener()
    this.onMouseMove = new Listener()
    this.onMouseLeave = new Listener()
  }

  hook(eventTag: 'up' | 'down' | 'move' | 'leave', event: ClientMouseEvent ) {
    const e : MouseEvent = {
      x: event.x,
      y: event.y
    }
    if (this.entity.mode.value === 'running') {
      switch (eventTag) {
        case 'up': this.onMouseUp.trigger(e); break
        case 'down': this.onMouseDown.trigger(e); break
        case 'move': this.onMouseMove.trigger(e); break
        case 'leave': this.onMouseLeave.trigger(e); break
      }
    }
  }
}


