// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import { IndexRoute, Router, Route, Link, browserHistory } from 'react-router'
import * as request from './request'
import * as api from '../../server/api'
import Ide from './ide'

class Main extends React.Component {
  render() {
    return <div>{this.props.children}</div>
  }
}

class Signup extends React.Component {
  state: { email: string, password: string, error: ?string };

  constructor(props) {
    super(props)
    this.state = { email: "", password: "", error: null }
  }

  signup() {
    request.to(api.signup, undefined, { email: this.state.email, password: this.state.password})
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
    request.to(api.login, undefined, { email: this.state.email, password: this.state.password})
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
        <IndexRoute component={Ide}/>
        <Route path="login" component={Login} />
        <Route path="signup" component={Signup} />
      </Route>
    </Router>
  }
}
ReactDOM.render(<App/>, document.getElementById('app'))
