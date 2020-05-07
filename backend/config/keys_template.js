//Store keys seperatly, so we can disable this file from beeing uploaded to public gits
const key = {
  session: "The key used for sessions "
};

module.exports = key;

class Todo extends Model {
  static get tableName() {
    return "todos";
  }

  // defines the relations to other models.
  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "todos.user_id",
          to: "users.id"
        }
      }
    };
  }
}
