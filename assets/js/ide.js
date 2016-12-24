// @flow

import React from 'react'
import {render} from './react'
import {Engine, Entity, Component, Scene, Thing} from './entity'
import * as schema from './schema'

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

  renderKey(i: number) {
    const entry = this.props.schema.tree[i]
    const key = Object.keys(entry)[0]
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
      keys.push(<li>
        <div>{i}</div>
        {this.renderKey(i)}
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
    const cl = this.props.component.constructor
    return <div>
      <h2>{cl.name}</h2>
      <SchemaEditor
        onSet={n => this.props.component.set(n)}
        schema={cl.schema}
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
    return <div>
      <h1>
        {this.props.entity.identity}
      </h1>
      {this.props.entity.components.map(component => <ComponentEditor component={component} />)}
    </div>
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
    this.state = {engine: engine, thing: thing}
  }

  render() {
    return <div>
      <EntityEditor entity={this.state.thing} />
      {render(this.state.engine)}
    </div>
  }
}
