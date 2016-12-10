// @flow

import React from 'react'
import {Render, Entity, Mouse} from './entity'

function mouseHooks(mouse: ?Mouse) {
  return  {
    onMouseDown: (e: SyntheticMouseEvent) => mouse ? mouse.hook('down', e) : null,
    onMouseUp: (e: SyntheticMouseEvent) => mouse ? mouse.hook('up', e) : null,
    onMouseMove: (e: SyntheticMouseEvent) => mouse ? mouse.hook('move', e) : null
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
}

export function render(rs: Render[]) {
  const elements = []
  const draw = new ReactSvgDraw(elements)
  rs.forEach(r => r.render(draw))
  return <svg
    width="120"
    height="120"
    viewBox="0 0 120 120"
    xmlns="http://www.w3.org/2000/svg">
    {elements}
  </svg>
}

