// @flow

export type Error = {
  path: Array<string>,
  value: any,
  message: string
}

export class Prop {
  validate(n: any): Array<Error> {
    return [this.error(n, 'not implemented validation')]
  }

  error(value: any, message: string, path: Array<string> = []): Error {
    return { value: value, message: message, path: path }
  }
}

export class InstanceOf<C> extends Prop {
  cl: Class<C>

  constructor(cl: Class<C>) {
    super()
    this.cl = cl
  }

  validate(n: any): Array<Error> {
    if (!(n instanceof this.cl)) {
      const cl : any = this.cl
      return [this.error(n, 'not an ' + cl.name)]
    }
    return []
  }
}

export class Optional extends Prop {
  inner: Prop

  constructor(inner: Prop) {
    super()
    this.inner = inner
  }

  validate(n: any) {
    if (n === undefined) {
      return []
    }
    return this.inner.validate(n)
  }
}

export class Number extends Prop {
  validate(n: any): Array<Error> {
    if (typeof n !== 'number') {
      return [this.error(n, 'not a number')]
    }
    return []
  }
}

export class Obj extends Prop {
  validate(n: any) {
    if(!n instanceof Object) {
      return [this.error(n, 'is not an object')]
    }
    return []
  }
}

export class Color extends Prop {
}

export class Enum extends Prop {
  values: Array<string>

  constructor(values: Array<string>) {
    super()
    this.values = values
  }

  validate(n: any) {
    if (this.values.indexOf(n) < 0) {
      return [this.error(n, 'is not allowed enum value')]
    }
    return []
  }
}

export class Tree extends Prop {
  tree: Array<{[string]: Prop}>

  constructor(tree: [{[string]: Prop}]) {
    super()
    this.tree = tree
  }

  validate(n: any) {
    if(!n instanceof Object) {
      return [this.error(n, 'is not an object')]
    }
    const errors = []
    for(var i = 0; i < this.tree.length; i++) {
      const key = Object.keys(this.tree[i])[0]
      if (n[key] === undefined) {
        errors.push(this.error(null, 'missing value', [key]))
      } else {
        this.tree[i][key].validate(n[key])
          .forEach(e => {
            errors.push({...e, path: [key, ...e.path]})
          })
      }
    }
    return errors
  }
}

export class Normalized extends Prop {
  validate(n: any) {
    if (typeof n !== "number") {
      return [this.error(n, 'value must be a number')]
    }
    if (n < 0 || n > 1) {
      return [this.error(n, 'value must be between 0 .. 1')]
    }
    return []
  }
}

export class Stroke extends Tree {
  constructor() {
    super([
      { color: new Color },
      { opacity: new Normalized},
      { width: new Number},
      { linecap: new Enum(['butt', 'square', 'round']) }
    ])
  }
}

export class Fill extends Tree {
  constructor() {
    super([
      { color: new Color },
      { opacity: new Normalized}
    ])
  }
}
