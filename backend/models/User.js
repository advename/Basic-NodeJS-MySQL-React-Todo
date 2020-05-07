// Include Model
const { Model } = require("objection");

const bcrypt = require("bcrypt");

// Step 4 from test.js moved here
class User extends Model {
  static get tableName() {
    return "users";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["username", "email", "password"],

      properties: {
        id: { type: "integer" },
        name: { type: "string", minLength: 1, maxLength: 255 },

        // Use maxLength as a small mitigation for email regex attacks
        email: {
          type: "string",
          format: "email",
          maxLength: 254,
          errorMessage: { format: "Invalid email" }
        },

        password: { type: "string", minLength: 3, maxLength: 60 }
      }
    };
  }

  // Encrypt the password before it is stored in the database
  // Read more about beforeInsert: https://vincit.github.io/objection.js/api/model/instance-methods.html#beforeinsert
  // ONLY DO IT FOR BEFOREINSERT, not for beforeUpdate -> changing email would re-encrypt the already encrypted password...
  async $beforeInsert() {
    await bcrypt.hash(this.password, 10, (err, hash) => {
      this.password = hash;
    });
  }
}

// Export User class
module.exports = User;
