// @flow
//

const crumb = document.querySelector('#csrf-token').getAttribute('content')

export function post(url: string, data: {}): Promise<any> {
  return window.fetch(url, {
    method: 'post',
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
