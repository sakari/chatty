// @flow

import Listener from './listener'
import * as schema from './schema'

export class Component<Props: Object> {
  entity: Entity

  static schema = new schema.Obj
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
    this.props = {...this.props, ...props }
    this.entity.listeners.forEach(f => f(this.entity))
  }

  validate() {
    const c = this.constructor
    if (c) {
      return c.schema.validate(this.props)
    }
    return []
  }

  update() {}
}

export class Engine {
  identifiers: number = 0
  entities: Array<Entity> = []

  newIdentity() {
    return this.identifiers++
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

export class Entity {
  identity: number
  engine: Engine
  scene: ?Scene = null

  components: Component<any>[] = []
  add<P: Object>(c: Component<P>) {
    this.components.push(c)
  }

  constructor(engine: Engine) {
    this.identity = engine.newIdentity()
    this.engine = engine
    this.engine.addEntity(this)
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

  listeners: Array<(e: Entity) => void> = []

  onUpdated(fn: (e: Entity) => void) {
    this.listeners.push(fn)
  }

  validate() {
    const errors = []
    for(var i = 0; i < this.components.length; i++) {
      errors.push(...this.components[i].validate())
    }
    return errors
  }
}

export class Container extends Component<{}> {
  constructor(e: Entity) {
    super(e, {})
  }

  entities: Array<Entity> = []

  addEntity(e: Entity) {
    this.entities.push(e)
  }

  components<C>(cc: Class<C>): Array<C> {
    return this
      .entities
      .map(e => e.maybeComponent(cc))
      .reduce((m, c) => c ? [...m, c] : m, [])
  }
}

export class Translation extends Component<{
  x: number,
  y: number,
  z: number,
  rotation: number
}> {

  static schema = new schema.Tree({
    x: new schema.Number,
    y: new schema.Number,
    z: new schema.Number,
    rotation: new schema.Number
  })

  constructor(e: Entity) {
    super(e, { x: 0, y: 0, z: 0, rotation: 0})
  }
}

export interface Draw {
  +scene: (e: Entity, width: number, height: number, children: Array<Render<*>>) => void,
  +rect: (e: Entity, x: number, y: number, width: number, height: number) => void
}

type MouseEvent = { movementX : number, movementY: number}
type ClientMouseEvent = { clientX: number, clientY: number }
type MouseHandler = (e: MouseEvent) => void
export class Mouse extends Component<{}> {
  onMouseDown: Listener<MouseEvent>
  onMouseUp: Listener<MouseEvent>
  onMouseMove: Listener<MouseEvent>
  onMouseLeave: Listener<MouseEvent>

  previousPosition: {
    clientX: number,
    clientY: number
  }

  constructor(e: Entity) {
    super(e, {})
    this.onMouseDown = new Listener()
    this.onMouseUp = new Listener()
    this.onMouseMove = new Listener()
    this.onMouseLeave = new Listener()
  }

  hook(eventTag: 'up' | 'down' | 'move' | 'leave', event: ClientMouseEvent ) {
    if (!this.previousPosition)
      this.previousPosition = {
        clientX: event.clientX,
        clientY: event.clientY
      }
    const e : MouseEvent = {
      movementX: event.clientX - this.previousPosition.clientX,
      movementY: event.clientY - this.previousPosition.clientY
    }
    if (eventTag === 'move')
      this.previousPosition = {
        clientX: event.clientX,
        clientY: event.clientY
      }
    switch (eventTag) {
      case 'up': this.onMouseUp.trigger(e); break
      case 'down': this.onMouseDown.trigger(e); break
      case 'move': this.onMouseMove.trigger(e); break
      case 'leave': this.onMouseLeave.trigger(e); break
    }
  }
}

export class Drag extends Component<{}> {
  state: 'up' | 'down'

  constructor(e: Entity) {
    super(e, {})
    this.state = 'up'
    const mouse = this.component(Mouse)
    mouse.onMouseDown.on(this, this.down)
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
      t.set({x: t.props.x + e.movementX, y: t.props.y + e.movementY })
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

export class ContainerRender extends Render<{}> {
  constructor(e: Entity) {
    super(e, {})
  }

  render(draw: Draw) {
    draw.scene(this.entity, 600, 600, this.entity.component(Container).components(Render))
  }
}

export class Scene extends Entity {
  constructor(e: Engine) {
    super(e)
    new Mouse(this)
    new Container(this)
    new ContainerRender(this)
  }

  addEntity(e: Entity) {
    this.component(Container).addEntity(e)
    e.scene = this
  }
}

export class Thing extends Entity {
  constructor(e: Engine) {
    super(e)
    new Translation(this, { x: 10, y: 0, z: 0, rotation: 0})
    new Rect(this)
    new Mouse(this)
    new Drag(this)
  }
}

