exports.up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.string("id", 255).notNullable();
    table.string("password").notNullable();
    table.string("username").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
