exports.up = function(knex) {
  return knex.schema.createTable("friends", function(table) {
    table.increments("id");
    table.string("name").notNullable();
    table.string("email").notNullable();
    table.string("whatsapp").notNullable();

    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("friends");
};
