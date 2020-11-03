exports.up = function (knex) {
  return knex.schema.createTable("timers", function (table) {
    table.string("id", 255).notNullable();
    table.boolean("isActive").notNullable();
    table.bigInteger("start").notNullable();
    table.bigInteger("end").default(null);
    table.bigInteger("progress").default(null);
    table.string("description", 255);
    table.bigInteger("duration").default(null);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("timers");
};
