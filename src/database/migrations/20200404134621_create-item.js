exports.up = function(knex) {
  return knex.schema.createTable("items", function(table) {
    table.increments("id");
    table.string("title").notNullable();
    table.string("description").notNullable();

    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("items");
};
