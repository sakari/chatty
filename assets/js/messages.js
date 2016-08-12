// @flow
//

import React from 'react'
import * as request from './request'
import * as api from '../../server/api'
import { Link } from 'react-router'
import {AutoSizer, VirtualScroll} from 'react-virtualized'
import 'react-virtualized/styles.css'
import {List} from 'immutable'

class Message extends React.Component {
  props: {
    message: api.Message
  }

  render() {
    return <Link key={this.props.message.id} to={'/messages/' + this.props.message.id}>{this.props.message.text}</Link>
  }
}

class MessageList extends React.Component {
  props: {
    rows: List<api.Message>
  }

  state: {
    showLatest: boolean
  }

  constructor(props: mixed) {
    super(props)
    this.state = { showLatest: true }
  }

  onScroll(position) {
    const snap = 20
    this.setState({showLatest: position.clientHeight + position.scrollTop + snap >= position.scrollHeight})
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.rows !== this.props.rows
  }

  render() {
    return <AutoSizer>
      {({width, height}) =>
        <VirtualScroll
          scrollToIndex={this.state.showLatest ? this.props.rows.size - 1: undefined}
          scrollToAlignment="end"
          onScroll={scroll => this.onScroll(scroll)}
          width={width}
          height={height}
          rowHeight={20}
          rowCount={this.props.rows.size}
          rowRenderer={({index}) => <Message message={this.props.rows.get(index)}/> }
        />
      }
    </AutoSizer>
  }
}

export default class Messages extends React.Component {
  state: {
    messages: List<api.Message>,
    inputValue: string
  }

  constructor(props: mixed) {
    super(props)
    this.state = {
      messages: List(),
      inputValue: "",
    }
  }
  componentWillMount() {
    this.loadMessages()
  }

  loadMessages() {
    request.to(api.messages)
      .then(response => {
        this.setState({messages: List(response.messages)})
      })
  }

  sendMessage() {
    if (this.state.inputValue !== '') {
      request.to(api.postMessage, { text: this.state.inputValue })
        .then(response => {
          console.log(response)
          this.setState({inputValue: ''})
          this.loadMessages()
        })
    }
  }

  render() {
    return <div style={{height: '100vh'}}>
        <MessageList rows={this.state.messages} />
        <div style={{position: 'fixed', bottom: 0}}>
          <input
            type="text"
            placeholder="Type your message here"
            value={this.state.inputValue}
            onKeyPress={({key}) => key === 'Enter' && this.sendMessage()}
            onChange={event => this.setState({inputValue: event.target.value})}/>
          <button onClick={() => this.sendMessage()}>Send</button>
        </div>
      </div>
  }
}

