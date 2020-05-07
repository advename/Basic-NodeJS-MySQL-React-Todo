const express = require("express");
const router = express.Router();
const Todo = require(__dirname + "/../../models/Todo.js"); // Extra: Import the User
const { isAuthenticated } = require(__dirname + "/../../helpers/auth.js");

/**
 * Get all todos
 */
router.get("/", isAuthenticated, async (req, res, next) => {
  const todos = await Todo.query()
    .withGraphFetched("user")
    .orderBy("id", "desc");
  res.json(todos);
});

/**
 * Get one specific todo
 */
router.get("/:todoId/", isAuthenticated, async (req, res, next) => {
  const todos = await Todo.query()
    .findById(req.params.todoId)
    .withGraphFetched("user");
  res.json(todos);
});

/**
 * Create a new todo
 */
router.post("/", isAuthenticated, async (req, res, next) => {
  const { task } = req.body;
  try {
    const user_id = req.session.user.id;
    const todo = await Todo.query().insert({ task, user_id });
    res.json(todo);
  } catch (err) {
    next(err);
  }
});

/**
 * Delete a single todo
 */
router.delete("/", isAuthenticated, async (req, res, next) => {
  const { id } = req.body;

  // Find the user and if exists, delete it
  try {
    const todo = await Todo.query()
      .findById(id)
      .throwIfNotFound(); // throws an NotFoundError if the todo could not be found
    await todo.$query().delete(); // delete the todo
    res.json(todo); // return the deleted todo inside the body
  } catch (err) {
    next(err);
  }

  /**
   * NOTE
   * The reason why we use two queries instead of only one is
   * because of MySQL limitations. ".deleteById" only returns the amount of affected rows.
   * With our two queries approach, we can return the deleted data to the user.
   * It's not REST API standard to return the deleted data, but
   * one of many common practices to inform the user about a successfull removal.   *
   */
});

/**
 * Update the todo, only the "done" field
 */
router.patch("/", isAuthenticated, async (req, res, next) => {
  const { id, done } = req.body;
  try {
    const todo = await Todo.query()
      .findById(id)
      .throwIfNotFound(); // throws an NotFoundError if the todo could not be found
    await todo.$query().patch({ done }); // update the todo
    res.json(todo); // return the updated todo
  } catch (err) {
    next(err);
  }

  /**
   * NOTE
   * The reason why we use two queries instead of only one is
   * because of MySQL limitations. ".patchd" only returns the amount of affected rows.
   * With our two queries approach, we can return the updated data to the user.
   * It's not REST API standard to return the upadted data, but
   * one of many common practices to inform the user about a successfull update.
   */
});

// Export to api.js
module.exports = router;
