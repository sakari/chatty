// @flow
//

import type {Api} from '../../server/api'
import {Map, List} from 'immutable'

const crumb = document.querySelector('#csrf-token').getAttribute('content')

function req(url: string, method: string, query, payload): Promise<any> {
  const queryStr = Map(query || {})
    .reduce((reduction, value, key) => reduction.push(encodeURIComponent(key) + '=' + encodeURIComponent(value)), List())
    .join('&')

  const urlWithQuery = url + (queryStr === '' ? '' : ('?' + queryStr))
  return window.fetch(urlWithQuery, {
    method: method,
    body: JSON.stringify(payload),
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

export function to<queryt, payloadt, out>(api: Api<queryt, payloadt, out>, query: queryt, payload: payloadt): Promise<out> {
  return req(api.path, api.method, query, payload)
}

export function post(url: string, data: {}): Promise<any> {
  return req(url, 'post', undefined, data)
}

