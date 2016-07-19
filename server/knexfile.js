// @flow

export const development = {
  client: 'pg',
  connection: {
    host     : '127.0.0.1',
    user     : 'sakari',
    password : 'chatdbpassword',
    database : 'chatdb',
    charset  : 'utf8'
  },
  migrations: {
    tableName: 'migrations'
  },
  pool: {
    min: 0,
    max: 7
  }
}
