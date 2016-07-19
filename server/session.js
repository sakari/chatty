// @flow

import S from './models/session'
import User from './models/user'
import crypto from 'crypto'

export default class Session extends S {
  static createForUser(user: User) {
    return new Promise((ok, fail) => {
      crypto.randomBytes(40, (err, buf) => {
        if (err) return fail(err)
        ok(new Session({user_id: user.get('id'), token: buf.toString('hex')})
          .save())
      })
    })
  }
}
