exports.up = function(knex) {
  return knex.schema
    .createTable("users", table => {
      table.increments("id");
      table.string("username").notNullable();
      table.string("email").notNullable();
      table.string("password").notNullable();
      table.string("recover_password_token");
      table.boolean("recover_password_active").defaultTo(false);
      table.datetime("recover_password_exp_date");
    })

    .createTable("todos", table => {
      table.increments("id");
      table.string("task").notNullable();
      table.boolean("done").defaultTo(false);
      table
        .integer("user_id")
        .unsigned()
        .notNullable();

      // Set the foreign key
      table
        .foreign("user_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    });
};

exports.down = function(knex) {
  return (
    knex.schema
      // Here, delete tables in reverse order because todos depends on users
      .dropTableIfExists("todos")
      .dropTableIfExists("users")
  );
};
