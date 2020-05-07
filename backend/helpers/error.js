/**
 * Custom Objection.js error handler
 */

// Import all Error types
const {
  ValidationError,
  NotFoundError,
  DBError,
  ConstraintViolationError,
  UniqueViolationError,
  NotNullViolationError,
  ForeignKeyViolationError,
  CheckViolationError,
  DataError
} = require("objection");

// Our custom Error Handler
// err and res are arguments coming from Express.js
// Implement somewhere in the function a way for YOU to retrieve the error. That can be an log file or one of the previously mentioned error monitoring products.
function errorHandler(err, res) {
  // Handle Error with type ValidationError -> User input data was false
  if (err instanceof ValidationError) {
    switch (err.type) {
      case "ModelValidation":
        res.status(400).send({
          message: err.message,
          type: err.type,
          data: err.data
        });
        break;
      case "RelationExpression":
        res.status(400).send({
          message: err.message,
          type: "RelationExpression",
          data: {}
        });
        break;
      case "UnallowedRelation":
        res.status(400).send({
          message: err.message,
          type: err.type,
          data: {}
        });
        break;
      case "InvalidGraph":
        res.status(400).send({
          message: err.message,
          type: err.type,
          data: {}
        });
        break;
      default:
        res.status(400).send({
          message: err.message,
          type: "UnknownValidationError",
          data: {}
        });
        break;
    }
  } else if (err instanceof NotFoundError) {
    // Handle Error with type NotFoundError -> manually invoked using "throw new NotFoundError"
    res.status(404).send({
      message: err.message,
      type: "NotFound",
      data: {}
    });
  } else if (err instanceof UniqueViolationError) {
    // Handle Error with type UniqueViolationError -> database threw a constraint error
    res.status(409).send({
      message: err.message,
      type: "UniqueViolation",
      data: {
        columns: err.columns,
        table: err.table,
        constraint: err.constraint
      }
    });
  } else if (err instanceof NotNullViolationError) {
    // Handle Error with type NotNullViolationError -> database threw a constraint error
    res.status(400).send({
      message: `${err.column} can not be null`,
      type: "NotNullViolation",
      data: {}
    });
  } else if (err instanceof ForeignKeyViolationError) {
    // Handle Error with type ForeignKeyViolationError -> database threw a constraint error
    res.status(409).send({
      message: err.message,
      type: "ForeignKeyViolation",
      data: {
        table: err.table,
        constraint: err.constraint
      }
    });
  } else if (err instanceof CheckViolationError) {
    // Handle Error with type ForeignKeyViolationError -> database threw a check constraint error; not available for MySQL
    res.status(400).send({
      message: err.message,
      type: "CheckViolation",
      data: {
        table: err.table,
        constraint: err.constraint
      }
    });
  } else if (err instanceof DataError) {
    // Handle Error with type DataError -> database threw a invalid data error
    res.status(400).send({
      message: err.message,
      type: "InvalidData",
      data: {}
    });
  } else if (err instanceof DBError) {
    // Handle Error with type DBError -> database threw an error too broad to handle specifically
    res.status(500).send({
      //   message: err.message, // -> modified: It could be possible that the err contains sensitive data
      message: "Unknown Error",
      type: "UnknownDatabaseError",
      data: {}
    });
  } else if (err instanceof CustomError) {
    // Handle Error with type Custom Error -> Error you have to throw yourself
    res.status(err.statusCode).send({
      message: err.message,
      type: err.type,
      data: err.data
    });
  } else {
    // Handle every other error generally
    res.status(500).send({
      //   message: err.message, // -> modified: It could be possible that the err contains sensitive data
      message: "Unknown Error",
      type: "UnknownError",
      data: {}
    });
  }
}

/**
 * Custom error handler class, throw it if you wish to present your own status code, with message, type and additional data.
 */
class CustomError extends Error {
  constructor(statusCode = 500, message, type = "Error", data = {}) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.type = type;
    this.data = data;
    this.name = this.constructor.name;
  }
}

module.exports = {
  errorHandler,
  CustomError
};
