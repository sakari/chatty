// @flow

const anything : any = undefined

export class Api<In, Out> {
  path: string
  method: 'get' | 'post' | 'put' | 'delete'
  inWitness: In
  outWitness: Out

  constructor(path: string) {
    this.path = path
    this.method = 'get'
  }

  post(): Api<In, Out> {
    const api = new Api(this.path)
    api.method = 'post'
    return api
  }
}

export const signup : Api<{email: string, password: string}, {}> =
  new Api('/signup').post()

export const login : Api<{email: string, password: string}, {}> =
  new Api('/login').post()

