// @flow

export class Component {
  entity: Entity

  constructor(e: Entity) {
    this.entity = e
    e.add(this)
  }

  component<C>(cc: Class<C>): C {
    return this.entity.component(cc)
  }

  update() {}
}

export class Entity {
  components: Component[] = []
  add(c: Component) {
    this.components.push(c)
  }

  component<C>(cc: Class<C>): C {
    for(var i = 0; i <= this.components.length; i++) {
      const c = this.components[i]
      if ( c && c instanceof cc ){
        return c
      }
    }
    const x: any = cc
    throw new Error('Could not find component: ' + x.name)
  }

  update() {
    this.components.forEach(c => c.update())
  }
}

export class Translation extends Component {
  props: {
    x: number,
    y: number,
    z: number,
    rotation: number
  }

  constructor(e: Entity) {
    super(e)
    this.props = { x: 0, y: 0, z: 0, rotation: 0}
  }
}

export class Move extends Component {
  props: {
    amount: number
  }

  constructor(e: Entity) {
    super(e)
    this.props = { amount: 0 }
  }

  componentUpdate() {
    const t = this.component(Translation)
    t.props.x += this.props.amount
  }
}

export interface Draw {
  +rect: (x: number, y: number, width: number, height: number) => void
}

export class Render extends Component {
  render(draw: Draw) {}
}

export class Rect extends Render {
  render(draw: Draw) {
    const t = this.component(Translation)
    draw.rect(t.props.x, t.props.y, 20, 10)
  }
}

export class Thing extends Entity {
  constructor() {
    super()
    new Translation(this, { x: 0, y: 0, z: 0, rotation: 0})
    new Rect(this)
  }
}

