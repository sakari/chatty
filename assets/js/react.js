// @flow

import React from 'react'
import {Engine, Render, Entity, Mouse, Scene, Container} from './entity'

function mouseHooks(mouse: ?Mouse) {
  return  {
    onMouseDown: (e: SyntheticMouseEvent) => mouse ? mouse.hook('down', e) : null,
    onMouseUp: (e: SyntheticMouseEvent) => mouse ? mouse.hook('up', e) : null,
    onMouseMove: (e: SyntheticMouseEvent) => mouse ? mouse.hook('move', e) : null,
    onMouseLeave: (e: SyntheticMouseEvent) => mouse ? mouse.hook('leave', e) : null
  }
}

class ReactSvgDraw {
  elements: React.Element<*>[]

  constructor(elements: React.Element<*>[]) {
    this.elements = elements
  }

  rect(entity: Entity, x: number, y: number, width: number, height: number) {
    const m = entity.maybeComponent(Mouse)
    this.elements.push(<rect x={x} y={y} width={width} height={height} {...mouseHooks(m)}/>)
  }

  scene(entity: Entity, width: number, height: number, children: Array<Render<*>>) {
    const m = entity.maybeComponent(Mouse)
    this.elements.push(<svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      {...mouseHooks(m)}
    >
      {children.map(child => <ReactRenderer component={child} />)}
    </svg>)
  }
}

class ReactRenderer extends React.Component {
  props: {
    component: Render<*>
  }

  componentDidMount() {
    this.props.component.entity.onUpdated(() => this.forceUpdate())
  }

  render() {
    const elements = []
    const draw = new ReactSvgDraw(elements)
    this.props.component.render(draw)
    return <g key={this.props.component.entity.identity}>{elements}</g>
  }
}

export function render(engine: Engine) {
  return <ReactRenderer component={engine.scenes()[0].component(Render)} />
}
