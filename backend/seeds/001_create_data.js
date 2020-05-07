exports.seed = function(knex) {
  // Deletes ALL data of todos
  return knex("todos")
    .del()
    .then(() => {
      //Delete ALL data of users
      return knex("users").del();
    })
    .then(() => {
      //Inserts new data into users
      return knex("users").insert([
        {
          username: "marc1",
          email: "marc@example.com",
          password:
            "$2b$10$7IS2wQGXPMwl9U/r2Pk5L.9QnBj57VuUDpCiB5P6Xbdh.FpxbA5ri" // -> "hello"
        },
        {
          username: "jlo22",
          email: "jlo22@example.com",
          password:
            "$2b$10$SJR.7MZDrZRCR7yciv1X4.gHwEmu8ODKr5xcQCjlipKckMD3ZVaCW" // ->  "hello"
        },
        {
          username: "hakuna",
          email: "hakuna@example.com",
          password:
            "$2b$10$JFv1AF7qNizxvAJrl6gNmu.SzDWkRk0ILkN8kF/6qyqXacBdPkUhK" // -> "hello"
        }
      ]);
    })
    .then(users => {
      /**
       * We can use the callback of the previous users inserts,
       * which returns a single item or an array of items (array only available in PostgreSQL), to
       * insert todos data and establish the relationship with users.
       */
      return knex("todos").insert([
        {
          user_id: 1,
          task: "Buy Milk",
          done: 1
        },
        {
          user_id: 1,
          task: "Walk the dog"
        },
        {
          user_id: 2,
          task: "Call grandma"
        }
      ]);
    });
};
