// @flow
import React from 'react'

export default class Default extends React.Component {
  render() {
    return (
      <html>
      <head>
        <meta charSet="utf-8"></meta>
        <meta content={this.props.crumb} id="csrf-token" />
        <title>Chat</title>
      </head>
      <body>
        <div id="app"></div>
        <script src="/assets/js/bundle.js"></script>
      </body>
      </html>
    )
  }
}
