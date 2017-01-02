// @flow

import Listener from './listener'
export default class State<Value> {
  listen: Listener<Value> = new Listener()
  value: Value

  constructor(value: Value) {
    this.value = value
  }

  set(value: Value) {
    if (this.value !== value) {
      this.value = value
      this.listen.trigger(this.value)
    }
  }
}
