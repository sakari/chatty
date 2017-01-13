// @flow

import React from 'react'
import Entity from './entity'
import Draw from './draw'
import type {Stroke, Fill} from './draw'
import Engine from './engine'
import Mouse from './components/mouse'
import Render from './components/render'

function hook(mouse, tag) {
  return e => {
    const {left, top} = e.currentTarget.getBoundingClientRect()
    return mouse.hook(tag, { x: e.clientX - left, y: e.clientY - top})
  }
}

function mouseHooks(mouse: ?Mouse) {
  if (!mouse)
    return {}
  return  {
    onMouseDown: hook(mouse, 'down'),
    onMouseUp: hook(mouse, 'up'),
    onMouseMove: hook(mouse, 'move'),
    onMouseLeave: hook(mouse, 'leave')
  }
}

class ReactSvgDraw extends Draw {
  elements: React.Element<*>[]

  constructor(elements: React.Element<*>[]) {
    super()
    this.elements = elements
  }

  strokeToReact(stroke: Stroke) {
    return {
      stroke: stroke.color,
      strokeWidth: stroke.width,
      strokeOpacity: stroke.opacity,
      strokeLinecap: stroke.linecap
    }
  }

  fillToReact(fill: Fill) {
    return {
      fill: fill.color,
      fillOpacity: fill.opacity
    }
  }

  rect(entity: Entity, x: number, y: number, width: number, height: number, stroke: Stroke, fill: Fill) {
    const m = entity.maybeComponent(Mouse)
    this.elements.push(<rect
      key={this.elements.length}
      x={x - width / 2}
      y={y - height / 2}
      width={width}
      height={height}
      {...this.strokeToReact(stroke)}
      {...this.fillToReact(fill)}
      {...mouseHooks(m)}/>)
  }

  scene(entity: Entity, width: number, height: number, children: Array<Render<*>>) {
    const m = entity.maybeComponent(Mouse)
    this.elements.push(<svg
      key={this.elements.length}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      {...mouseHooks(m)}
    >
      {children.map(child =>
        <ReactRenderer key={child.entity.identity} component={child} />)
      }
    </svg>)
  }
}

class ReactRenderer extends React.Component {
  props: {
    component: Render<*>
  }

  componentDidMount() {
    this.props.component.entity.listeners.on_(this, this.forceUpdate)
  }

  render() {
    if (this.props.component.entity.mode.value === 'disabled') {
      return null
    } else {
      const elements = []
      const draw = new ReactSvgDraw(elements)
      this.props.component.render(draw)
      return <g key={this.props.component.entity.identity}>{elements}</g>
    }
  }
}

export function render(engine: Engine) {
  return <ReactRenderer component={engine.scenes()[0].component(Render)} />
}
