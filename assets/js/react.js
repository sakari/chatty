// @flow

import React from 'react'
import {Render} from './entity'

class ReactSvgDraw {
  elements: React.Element<*>[]
  constructor(elements: React.Element<*>[]) {
    this.elements = elements
  }
  rect(x: number, y: number, width: number, height: number) {
    this.elements.push(<rect x={x} y={y} width={width} height={height}/>)
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

