// @flow

import knex from 'bookshelf-flow/knex'
import bookshelf from 'bookshelf-flow/bookshelf'
import * as knexfile from './knexfile'
export default bookshelf(knex(knexfile[process.env.NODE_ENV || 'development']));
