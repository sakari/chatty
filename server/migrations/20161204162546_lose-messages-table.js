
exports.up = function(knex, Promise) {
  return knex.schema.dropTableIfExists('messages')
};

exports.down = function(knex, Promise) {
  return Promise.resolve()
};
