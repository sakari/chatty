// @flow

const anything : any = undefined

export class Api<query, payload, out> {
  path: string
  method: 'get' | 'post' | 'put' | 'delete'

  constructor(path: string) {
    this.path = path
    this.method = 'get'
  }

  post(): Api<query, payload, out> {
    const api = new Api(this.path)
    api.method = 'post'
    return api
  }

  sub<query2, payload2, out2>(path: string): Api<query2, payload2, out2> {
    return new Api(this.path + path)
  }
}

export const signup : Api<void, {email: string, password: string}, {}> =
  new Api('/signup').post()

export const login : Api<void, {email: string, password: string}, {}> =
  new Api('/login').post()

export type MessageId = number
export type Message = {
  id: MessageId,
  text: string,
  group: string
}

const api = new Api('/api')

export const messages : Api<?{before?: MessageId, limit?: number}, void, { messages: Array<Message>}> =
  api.sub('/messages')

export const postMessage : Api<void, {text: string}, Message> =
  api.sub('/messages/create').post()

