// @flow
//

export class Api<In, Out> {
  url: string;

  constructor(url: string) {
    this.url = url
  }
}

export const login : Api<{email: string, password: string}, void> = new Api('/path')

