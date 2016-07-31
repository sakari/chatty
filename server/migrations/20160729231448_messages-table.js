// @flow

import typeof {Knex} from 'bookshelf-flow/knex'

export const up = (knex: Knex) =>
  knex.schema.createTable('messages', table => {
    table.increments()
    table.text('text')
    table.text('group')
    table.timestamps()
  })

export const down = (knex: Knex) =>
  knex.schema.dropTableIfExists('messages')
