// @flow

import React from 'react'
import {render} from './react'
import Scene from './scene'
import IdeEntity from './ide_entity'
import Entity from './entity'
import Component from './component'
import Engine from './engine'
import * as schema from './schema'
import Hover from './components/hover'
import Mouse from './components/mouse'
import Translation from './components/translation'
import Drag from './components/drag'
import Rect from './components/rect'

class NormalizedEditor extends React.Component {
  props: {
    value: number,
    schema: schema.Normalized,
    onSet: (n: number) => void
  }

  render() {
    const value = this.props.value || 0
    return <span>
      <span>{value}</span>
      <input type="range" max="1" min="0" step="0.01" value={value} onChange={e => this.props.onSet(e.target.value)} />
    </span>
  }
}

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

class EnumEditor extends React.Component {
  props: {
    value: Array<string>,
    schema: schema.Enum,
    onSet: (n: number) => void
  }
  render() {
    return <select value={this.props.value} onChange={e => this.props.onSet(e.target.value)}>
      {this.props.schema.values.map(o =>
        <option key={o} value={o}>{o}</option> )}
      </select>
  }
}

class ColorEditor extends React.Component {
  props: {
    value: string,
    schema: schema.Color,
    onSet: (n: number) => void
  }
  render() {
    return <input type="color" value={this.props.value} onChange={e => this.props.onSet(e.target.value)}/>
  }
}

function editorForProp(prop: schema.Prop, value: any, onSet) {
  if (prop instanceof schema.Tree) {
    return <TreeEditor schema={prop} value={value} onSet={onSet}/>
  } else if (prop instanceof schema.Number) {
    return <NumberEditor schema={prop} value={value} onSet={onSet}/>
  } else if (prop instanceof schema.Optional) {
    return <OptionalEditor schema={prop} value={value} onSet={onSet}/>
  } else if (prop instanceof schema.Enum) {
    return <EnumEditor schema={prop} value={value} onSet={onSet}/>
  } else if (prop instanceof schema.Color) {
    return <ColorEditor schema={prop} value={value} onSet={onSet}/>
  } else if (prop instanceof schema.Normalized) {
    return <NormalizedEditor schema={prop} value={value} onSet={onSet}/>
  }
}

class OptionalEditor extends React.Component {
  props: {
    value: mixed,
    schema: schema.Optional,
    onSet: (n: mixed) => void
  }

  render() {
    const component = editorForProp(this.props.schema.inner, this.props.value, v => this.props.onSet(v))
    if (component) {
      return component
    }
    return <div>-</div>
  }
}

class TreeEditor extends React.Component {
  props: {
    value: Object,
    schema: schema.Tree,
    onSet: (n: Object) => void
  }

  set(key: string, value: any) {
    if (this.props.value) {
      this.props.onSet({...this.props.value, [key]: value})
    } else {
      this.props.onSet({[key]: value})
    }
  }

  renderKey(key: string, i: number) {
    const entry = this.props.schema.tree[i]
    const value = this.props.value ? this.props.value[key] : undefined
    const prop = entry[key]

    const component = editorForProp(prop, value, n => this.set(key, n))
    if (component) {
      return component
    }
    return <div>-</div>
  }

  renderKeys() {
    const keys = []
    for(var i = 0; i < this.props.schema.tree.length; i++) {
      const key = Object.keys(this.props.schema.tree[i])[0]
      keys.push(<li key={key}>
        <div>{key}</div>
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
    this.props.entity.listeners.on_(this, this.forceUpdate)
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
    new Rect(this, {width: 20, height: 20})
    new Mouse(this)
    new Drag(this)
    new Hover(this)
  }
}

class ThingIde extends IdeEntity {
  constructor(e: Engine, t: Thing) {
    super(e, t)
    new Rect(this, {width: 10, height: 40})
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
    scene.addEntity(new ThingIde(engine, thing))
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
