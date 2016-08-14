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

class Loader {
  load(): Promise<(msgs: MessageCollection) => MessageCollection> {
    throw new Error('dont call this')
  }
}

class FromLatest extends Loader{
  loading: Promise<(coll: MessageCollection) => MessageCollection>

  constructor() {
    super()
  }

  load() {
    if (this.loading) {
      return this.loading
    }
    this.loading = Promise.resolve(t => t)
    return request.to(api.messages, {})
      .then(response => collection => {
        const currentPosition = collection.messages.findKey(row => row.type === 'loader' && row.loader === this)
        if (currentPosition == null) {
          return collection
        }
        return collection.splice(currentPosition, 1, List(response.messages.map(msg => ({ type: 'message', msg }))))
      })
  }
}

type Rows = List<{type: 'message', msg: api.Message} | {type: 'loader', loader: Loader }>

class MessageCollection {
  messages: Rows
  size: number
  observer: (sink: (coll: MessageCollection) => MessageCollection) => mixed

  constructor(opts: { messages?: Rows, observer: (sink: (coll: MessageCollection) => MessageCollection) => mixed}) {
    this.messages = opts.messages || List.of({ type: 'loader', loader: new FromLatest()})
    this.size = this.messages.size
    this.observer = opts.observer
  }

  splice(index, deleteCount, messages: Rows) {
    return new MessageCollection({ messages: this.messages.splice(index, deleteCount, ...messages.toArray()), observer: this.observer})
  }

  load(startIndex: number, endIndex: number) {
    for(var i = startIndex; i < endIndex; i++) {
      const row = this.messages.get(i)
      if (row.type === 'loader') {
        row.loader.load().then(this.observer)
      }
    }
  }

  get(index: number): ?api.Message {
    const row = this.messages.get(index)
    if (row && row.type === 'message')
      return row.msg
  }
}

class MessageList extends React.Component {
  props: {
    rows: MessageCollection
  }

  visibleRows: { overscanStartIndex: number, overscanStopIndex: number }

  state: {
    showLatest: boolean
  }

  constructor(props: mixed) {
    super(props)
    this.visibleRows = { overscanStartIndex: 0, overscanStopIndex: 0 }
    this.state = { showLatest: true }
  }

  componentDidUpdate() {
    this.load(this.visibleRows)
  }

  onScroll(position) {
    const snap = 20
    this.setState({showLatest: position.clientHeight + position.scrollTop + snap >= position.scrollHeight})
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.rows !== this.props.rows
  }

  load({overscanStartIndex, overscanStopIndex}) {
    this.visibleRows =  {overscanStartIndex, overscanStopIndex }
    this.props.rows.load(overscanStartIndex, overscanStopIndex + 1)
  }

  render() {
    return <AutoSizer>
      {({width, height}) =>
        <VirtualScroll
          scrollToIndex={this.state.showLatest ? this.props.rows.size - 1: undefined}
          scrollToAlignment="end"
          onScroll={scroll => this.onScroll(scroll)}
          onRowsRendered={arg => this.load(arg)}
          width={width}
          height={height}
          rowHeight={20}
          rowCount={this.props.rows.size}
          rowRenderer={({index}) => {
            const row = this.props.rows.get(index)
            if (row)
              return <Message message={row}/>
            return <div>Loading</div>
          }}
        />
      }
    </AutoSizer>
  }
}

export default class Messages extends React.Component {
  state: {
    messages: MessageCollection,
    inputValue: string
  }

  constructor(props: mixed) {
    super(props)
    this.state = {
      messages: new MessageCollection({ observer: fn => this.update(fn) }),
      inputValue: "",
    }
  }

  update(fn: (coll: MessageCollection) => MessageCollection) {
    this.setState({messages: fn(this.state.messages)})
  }

  sendMessage() {
    if (this.state.inputValue !== '') {
      request.to(api.postMessage, undefined, { text: this.state.inputValue })
        .then(response => {
          console.log(response)
          this.setState({
            inputValue: '',
            messages: this.state.messages.splice(
              this.state.messages.size, 0, List.of({ type: 'message', msg: response}))
          })
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

