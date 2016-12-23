// @flow

import React from 'react'
import {render} from './react'
import {Engine, Entity, Component, Scene, Thing} from './entity'
import * as schema from './schema'

class TreeEditor extends React.Component {
  props: {
    value: Object,
    schema: schema.Tree
  }

  renderKey(prop: schema.Prop, value: any) {
    if (prop instanceof schema.Tree) {
      return <TreeEditor schema={prop} value={value} />
    } else if (prop instanceof schema.Number) {
      return <div>{value}</div>
    }
    return <div>-</div>
  }

  renderKeys() {
    const keys = []
    for(var i in this.props.schema.tree) {
      keys.push(<li><div>{i}</div>{this.renderKey(this.props.schema.tree[i], this.props.value[i])}</li>)
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
    schema: schema.Prop
  }

  render() {
    if (this.props.schema instanceof schema.Tree) {
      return <TreeEditor schema={this.props.schema} value={this.props.value} />
    } else if (this.props.schema instanceof schema.Number) {
      return <div>number</div>
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
      <SchemaEditor schema={cl.schema} value={this.props.component.props} />
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
