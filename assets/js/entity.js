// @flow

export class Component {
  componentEntity: Entity

  constructor(e: Entity) {
    this.componentEntity = e
    e.entityAddComponent(this)
  }

  componentUpdate() {}
}

export class Entity {
  entityComponents: Component[]
  entityAddComponent(c: Component) {
    this.entityComponents.push(c)
  }

  entityGetComponent<C>(cc: Class<C>): ?C {
    for(var i = 0; i <= this.entityComponents.length; i++) {
      const c = this.entityComponents[i]
      if ( c && c instanceof cc ){
        return c
      }
    }
    return null
  }

  entityUpdate() {
    this.entityComponents.forEach(c => c.componentUpdate())
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
    const t = this.componentEntity.entityGetComponent(Translation)
    if (t) {
      t.props.x += this.props.amount
    }
  }
}

class MovingThing extends Entity {
  constructor() {
    super()
    const translation = new Translation(this, { x: 0, y: 0, z: 0, rotation: 0})
    new Move(this, { amount: 5 })
  }
}

