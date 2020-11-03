exports.up = function (knex) {
  return knex.schema.createTable("sessions", function (table) {
    table.string("sessionId", 255).notNullable();
    table.string("userId", 255).notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("sessions");
};
