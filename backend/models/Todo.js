// Import Model class from Objection.js
const { Model } = require("objection");

const User = require(__dirname + "/./User.js");

// Create the Todo model class
class Todo extends Model {
  static get tableName() {
    return "todos";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["task", "user_id"],

      properties: {
        id: { type: "integer" },
        task: { type: "string", minLength: 1, maxLength: 255 },
        done: {
          anyOf: [
            {
              //Accept one and zeros
              type: "integer",
              minimum: 0,
              maximum: 1
            },
            {
              //Accept true and false
              type: "boolean"
            }
          ]
        },
        user_id: { type: "integer" }
      }
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        filter: query => query.select("users.username"), // only return the username of the relative user
        join: {
          from: "todos.user_id",
          to: "users.id"
        }
      }
    };
  }
}

// Export the Todo to be used in routes
module.exports = Todo;
