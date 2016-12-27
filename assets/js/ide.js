// @flow

import React from 'react'
import {render} from './react'
import Scene from './scene'
import Entity from './entity'
import Component from './component'
import Engine from './engine'
import * as schema from './schema'
import Mouse from './components/mouse'
import Translation from './components/translation'
import Drag from './components/drag'
import Rect from './components/rect'

class NumberEditor extends React.Component {
  props: {
    value: number,
    schema: schema.Number,
    onSet: (n: number) => void
  }

  render() {
    return <input type="number" value={this.props.value} onChange={e => this.props.onSet(e.target.value)} />
  }
}

class TreeEditor extends React.Component {
  props: {
    value: Object,
    schema: schema.Tree,
    onSet: (n: Object) => void
  }

  set(key: string, value: any) {
    this.props.onSet({...this.props.value, [key]: value})
  }

  renderKey(key: string, i: number) {
    const entry = this.props.schema.tree[i]
    const value = this.props.value[key]
    const prop = entry[key]

    if (prop instanceof schema.Tree) {
      return <TreeEditor schema={prop} value={value} onSet={n => this.set(key, n)}/>
    } else if (prop instanceof schema.Number) {
      return <NumberEditor schema={prop} value={value} onSet={n => this.set(key, n)}/>
    }
    return <div>-</div>
  }

  renderKeys() {
    const keys = []
    for(var i = 0; i < this.props.schema.tree.length; i++) {
      const key = Object.keys(this.props.schema.tree[i])[0]
      keys.push(<li key={key}>
        <div>{i}</div>
        {this.renderKey(key, i)}
      </li>)
    }
    return keys
  }
  render() {
    return <ul>
      {this.renderKeys()}
    </ul>
  }
}

class SchemaEditor extends React.Component {
  props: {
    value: any,
    schema: schema.Prop,
    onSet: (n: any) => void
  }

  render() {
    if (this.props.schema instanceof schema.Tree) {
      return <TreeEditor
        onSet={this.props.onSet}
        schema={this.props.schema}
        value={this.props.value} />
    }
    return <div>unknown</div>
  }
}

class ComponentEditor extends React.Component {
  props: {
    component: Component<any>
  }
  render() {
    return <div key={this.props.component.name()}>
      <h2>{this.props.component.name()}</h2>
      <SchemaEditor
        onSet={n => this.props.component.set(n)}
        schema={this.props.component.constructor.schema}
        value={this.props.component.props} />
      </div>
  }
}

class EntityEditor extends React.Component {
  props: {
    entity: Entity
  }

  componentWillMount() {
    this.props.entity.onUpdated(() => this.forceUpdate())
  }

  render() {
    return <div style={{backgroundColor: 'lightblue'}}>
      <h1>
        {this.props.entity.identity}
      </h1>
      {this.props.entity.components.map(component =>
        <ComponentEditor key={component.name()} component={component} />)
      }
    </div>
  }
}

class Thing extends Entity {
  constructor(e: Engine) {
    super(e)
    new Translation(this, { x: 10, y: 0, z: 0, rotation: 0})
    new Rect(this)
    new Mouse(this)
    new Drag(this)
  }
}

export default class Ide extends React.Component {
  state: {
    engine: Engine,
    thing: Thing
  }
  constructor() {
    super()
    const engine = new Engine()
    const scene = new Scene(engine)
    const thing = new Thing(engine)
    scene.addEntity(thing)
    console.log(thing.validate())
    engine.mode.listen.on_(this, this.forceUpdate)
    this.state = {
      engine: engine,
      thing: thing
    }
  }

  toggleMode() {
    if (this.state.engine.mode.value === 'play') {
      this.state.engine.edit()
    } else {
      this.state.engine.play()
    }
  }

  render() {
    return <div style={{display: 'flex'}}>
      <div>
        <button onClick={() => this.toggleMode()}>{this.state.engine.mode.value === 'play' ? 'Edit' : 'Play'}</button>
        <EntityEditor entity={this.state.thing} />
      </div>
      <div style={{borderStyle: 'dashed'}}>
        {render(this.state.engine)}
      </div>
    </div>
  }
}
