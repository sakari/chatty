// @flow

type L<A>
  = {arg: true, t: Object,fn: (a: A) => mixed}
  | {arg: false, t: Object, fn: () => mixed }

export default class Listener<A> {
  listeners: Array<L<A>> = []
  on(t: Object, fn: (a: A) => mixed) {
    this.listeners.push({t, fn, arg: true})
  }

  on_(t: Object, fn: () => mixed) {
    this.listeners.push({t, fn, arg: false})
  }

  off(t: Object) {
    this.listeners = this.listeners.filter(l => l.t !== t)
  }

  trigger(a: A) {
    this.listeners.forEach(o => {
      o.arg ? o.fn.call(o.t, a) : o.fn.call(o.t)
    })
  }
}
