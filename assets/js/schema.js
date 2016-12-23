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

export class Tree extends Prop {
  tree: {[string]: Prop}

  constructor(tree: {[string]: Prop}) {
    super()
    this.tree = tree
  }

  validate(n: any) {
    if(!n instanceof Object) {
      return [this.error(n, 'is not an object')]
    }
    const errors = []
    for(var key in n) {
      if (!this.tree[key]) {
        errors.push(this.error(null, 'missing value', [key]))
      } else {
        this.tree[key].validate(n[key])
          .forEach(e => {
            errors.push({...e, path: [key, ...e.path]})
          })
      }
    }
    return errors
  }
}
