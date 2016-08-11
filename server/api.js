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

  sub<In2, Out2>(path: string): Api<In2, Out2> {
    return new Api(this.path + path)
  }
}

export const signup : Api<{email: string, password: string}, {}> =
  new Api('/signup').post()

export const login : Api<{email: string, password: string}, {}> =
  new Api('/login').post()

export type Message = {
  id: number,
  text: string,
  group: string
}

const api = new Api('/api')

export const messages : Api<void, { messages: Array<Message>}> =
  api.sub('/messages')

export const postMessage : Api<{text: string}, Message> =
  api.sub('/messages/create').post()

