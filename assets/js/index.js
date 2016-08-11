// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import { IndexRoute, Router, Route, Link, browserHistory } from 'react-router'
import * as request from './request'
import * as api from '../../server/api'

class Message extends React.Component {
  render() {
    return <div>Message {this.props.params.messageId}</div>
  }
}

class Main extends React.Component {
  render() {
    return <div>{this.props.children}</div>
  }
}

class All extends React.Component {
  state: {
    messages: Array<api.Message>,
    inputValue: string
  }

  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      inputValue: ""
    }
  }
  componentWillMount() {
    this.loadMessages()
  }

  loadMessages() {
    request.to(api.messages)
      .then(response => {
        this.setState({messages: response.messages})
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
    return <div>
        <div>
          {this.state.messages.map(m => <Link key={m.id} to={'/messages/' + m.id}>{m.text}</Link>)}
        </div>
        <input type="text" placeholder="Type your message here" value={this.state.inputValue} onChange={event => this.setState({inputValue: event.target.value})}/>
        <button onClick={() => this.sendMessage()}>Send</button>
      </div>
  }
}

class Signup extends React.Component {
  state: { email: string, password: string, error: ?string };

  constructor(props) {
    super(props)
    this.state = { email: "", password: "", error: null }
  }

  signup() {
    request.to(api.signup, { email: this.state.email, password: this.state.password})
      .then(response => {
        if (this.props.location.query && this.props.location.query.next) {
          window.location.href = this.props.location.query.next
        } else {
          window.location.href='/'
        }
      })
      .catch(e => {
        console.log(e)
        this.setState({error: 'failed to sign up', email: "", password: ""})
      })
  }

  render() {
    return <div>
    <input type="email" autocomplete="email" value={this.state.email} placeholder="email address" onChange={event => this.setState({email: event.target.value})} />
    <input type="password" autocomplete="new-password" value={this.state.password} placeholder="********" onChange={event => this.setState({password: event.target.value})} />
    <button onClick={() => this.signup()}>Signup</button>
    </div>
  }
}

class Login extends React.Component {
  state: { email: string, password: string, error: ?string };

  constructor(props) {
    super(props)
    this.state = { email: "", password: "", error: null }
  }
  login() {
    request.to(api.login, { email: this.state.email, password: this.state.password})
      .then(response => {
        if (this.props.location.query && this.props.location.query.next) {
          window.location.href = this.props.location.query.next
        } else {
          window.location.href='/'
        }
      })
      .catch(e => {
        console.log(e)
        this.setState({error: 'failed to log in', email: "", password: ""})
      })
  }

  render() {
    return <div>
      {this.state.error}
      <input type="email" autocomplete="email" value={this.state.email} placeholder="email address" onChange={event => this.setState({email: event.target.value})} />
      <input type="password" autocomplete="current-password" value={this.state.password} placeholder="********" onChange={event => this.setState({password: event.target.value})} />
      <button onClick={() => this.login(this.state)}>Login</button>
      <Link to={{ pathname: "/signup", query: this.props.location.query }}>Signup</Link>
    </div>
  }
}

class App extends React.Component {
  render() {
    return <Router history={browserHistory}>
      <Route path="/" component={Main}>
        <IndexRoute component={All}/>
        <Route path="login" component={Login} />
        <Route path="signup" component={Signup} />
        <Route path="messages/:messageId" component={Message} />
      </Route>
    </Router>
  }
}
ReactDOM.render(<App/>, document.getElementById('app'))
