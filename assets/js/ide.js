// @flow
import React from 'react'
import {render} from './react'
import * as entity from './entity'

export default class Ide extends React.Component {
  render() {
    const e = new entity.Thing()
    const rs = [e.component(entity.Render)]
    return render(rs)
  }
}
