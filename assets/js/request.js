// @flow
//

import type {Api} from '../../server/api'

const crumb = document.querySelector('#csrf-token').getAttribute('content')

function req(url: string, method: string, data: any): Promise<any> {
  return window.fetch(url, {
    method: method,
    body: JSON.stringify(data),
    credentials: 'same-origin',
    headers: {
      'X-CSRF-Token': crumb,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(result => {
    if (result.status >= 200 && result.status < 300) {
      return result.json()
    }
    return Promise.reject(result)
  })
}

export function to<In, Out>(api: Api<In, Out>, data: In): Promise<Out> {
  return req(api.path, api.method, data)
}

export function post(url: string, data: {}): Promise<any> {
  return req(url, 'post', data)
}
