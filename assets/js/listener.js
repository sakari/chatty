// @flow

type L<A> = {
  t: Object,
  fn: (a: A) => mixed
}

export default class Listener<A> {
  listeners: Array<L<A>> = []
  on(t: Object, fn: (a: A) => mixed) {
    this.listeners.push({t, fn})
  }

  off(t: Object) {
    this.listeners = this.listeners.filter(l => l.t !== t)
  }

  trigger(a: A) {
    this.listeners.forEach(o => {
      o.fn.call(o.t, a)
    })
  }
}
