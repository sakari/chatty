// @flow
//
import typeof {Knex} from 'bookshelf-flow/knex'

export const up = (knex: Knex) =>
  knex.schema.createTable('sessions', table => {
    table.increments()
    table.integer('user_id').references('id').inTable('users')
    table.timestamps()
    table.text('token').index()
  })

export const down = (knex: Knex) =>
  knex.schema.dropTableIfExists('sessions')
