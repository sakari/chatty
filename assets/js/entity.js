// @flow

export class Component<Props: Object> {
  entity: Entity

  props: Props

  constructor(e: Entity, props: Props) {
    this.entity = e
    this.props = props
    e.add(this)
  }

  component<C>(cc: Class<C>): C {
    return this.entity.component(cc)
  }

  set(props: $Supertype<Props>) {
    this.props = {...this.props, props }
  }

  update() {}
}

export class Entity {
  components: Component<*>[] = []
  add(c: Component<*>) {
    this.components.push(c)
  }

  maybeComponent<C>(cc: Class<C>): ?C {
    for(var i = 0; i <= this.components.length; i++) {
      const c = this.components[i]
      if ( c && c instanceof cc ){
        return c
      }
    }
  }

  component<C>(cc: Class<C>): C {
    const c = this.maybeComponent(cc)
    if (c) return c
    const x: any = cc
    throw new Error('Could not find component: ' + x.name)
  }

  update() {
    this.components.forEach(c => c.update())
  }
}

export class Translation extends Component<{
  x: number,
  y: number,
  z: number,
  rotation: number
}> {

  constructor(e: Entity) {
    super(e, { x: 0, y: 0, z: 0, rotation: 0})
  }
}

export interface Draw {
  +rect: (e: Entity, x: number, y: number, width: number, height: number) => void
}

type MouseEvent = { movementX : number, movementY: number}
type ClientMouseEvent = { clientX: number, clientY: number }
type MouseHandler = (e: MouseEvent) => void
export class Mouse extends Component<{}> {
  listeners: {
    onMouseDown: Array<MouseHandler>,
    onMouseUp: Array<MouseHandler>,
    onMouseMove: Array<MouseHandler>
  }

  previousEvent: ?ClientMouseEvent

  constructor(e: Entity) {
    super(e, {})
    this.listeners = {
      onMouseDown: [],
      onMouseUp: [],
      onMouseMove: []
    }
  }

  onMouseDown( m: MouseHandler) {
    this.listeners.onMouseDown.push(m)
  }

  onMouseUp(m: MouseHandler) {
    this.listeners.onMouseUp.push(m)
  }

  onMouseMove( m: MouseHandler) {
    this.listeners.onMouseMove.push(m)
  }

  hook(eventTag: 'up' | 'down' | 'move', event: ClientMouseEvent ) {
    if (!this.previousEvent) this.previousEvent = event
    const e : MouseEvent = {
      movementX: this.previousEvent.clientX - event.clientX,
      movementY: this.previousEvent.clientY - event.clientY
    }
    switch (eventTag) {
      case 'up': this.listeners.onMouseUp.forEach(f => f(e)); break
      case 'down': this.listeners.onMouseDown.forEach(f => f(e)); break
      case 'move': this.listeners.onMouseMove.forEach(f => f(e)); break
    }
  }
}

export class Drag extends Component<{}> {
  state: 'up' | 'down'

  constructor(e: Entity) {
    super(e, {})
    this.state = 'up'
    const mouse = this.component(Mouse)
    mouse.onMouseDown(this.down.bind(this))
    mouse.onMouseUp(this.up.bind(this))
    mouse.onMouseMove(this.move.bind(this))
  }

  up() {
    this.state = 'up'
  }

  down() {
    this.state = 'down'
  }

  move(e: MouseEvent) {
    if (this.state === 'down') {
      const t = this.component(Translation)
      this.set({x: t.props.x + e.movementX, y: t.props.y + e.movementY })
    }
  }
}

export class Render<P: Object> extends Component<P> {
  render(draw: Draw) {}
}

export class Rect extends Render<{}> {
  constructor(e: Entity) {
    super(e, {})
  }

  render(draw: Draw) {
    const t = this.component(Translation)
    draw.rect(this.entity, t.props.x, t.props.y, 20, 10)
  }
}

export class Thing extends Entity {
  constructor() {
    super()
    new Translation(this, { x: 0, y: 0, z: 0, rotation: 0})
    new Rect(this)
    new Mouse(this)
    new Drag(this)
  }
}

