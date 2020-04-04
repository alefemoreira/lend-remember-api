exports.up = function(knex) {
  return knex.schema.createTable("lendings", function(table) {
    table.increments("id");

    table.integer("user_id").notNullable();
    table.integer("friend_id").notNullable();
    table.integer("item_id").notNullable();

    table
      .foreign("user_id")
      .references("id")
      .inTable("users");
    table
      .foreign("friend_id")
      .references("id")
      .inTable("friends");
    table
      .foreign("item_id")
      .references("id")
      .inTable("items");

    table.date("lending_date").notNullable();
    table.date("receive_date").notNullable();
    table.boolean("received").notNullable();

    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("lendings");
};
