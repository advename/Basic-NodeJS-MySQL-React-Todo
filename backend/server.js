// Import dependencies
const express = require("express"); //Route and app handler
const morgan = require("morgan"); // Log HTTP transfers
const helmet = require("helmet"); //Security plugin
const Knex = require("knex");
const knexFile = require(__dirname + "/knexfile.js");
const { Model } = require("objection");
const apiRoutes = require(__dirname + "/routes/api"); // custom routes API handler
const { errorHandler, CustomError } = require(__dirname + "/helpers/error.js"); // custom errorHandler class
const session = require("express-session"); //Handle logged in sessions
const key = require(__dirname + "/config/keys.js"); //Store and import all keys
const KnexSessionStore = require("connect-session-knex")(session); // Store sessions in MySQL database using Knex (sessions MUST be stored outside of cache)
const nodemailer = require("nodemailer");

// Create express instance
const app = express();

// Accept JSON data
app.use(express.urlencoded({ extended: false })); // -> add this
app.use(express.json()); // -> add this

// Implement morgan
app.use(morgan("dev"));

// Implement Helmet
app.use(helmet());

// Implement CORS headers to make cross-origin requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "POST,GET,OPTIONS,PUT,DELETE, PATCH"
  );
  next();
});

// Implement Knex & Objection
const knex = Knex(knexFile.development);
Model.knex(knex);

// Initialize KnexSessionStore AFTER Knex configuration
const store = new KnexSessionStore({ knex }); // defaults to a sqlite3 database

// Implement Express-session AFTER Knex configuration
app.use(
  session({
    secret: key.session,
    name: "user_sid",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000
    },
    store: store
  })
);

// Include the routes to express
app.use("/api", apiRoutes);

// Include error handlers - must be the last one among other middleware or routes to function properly
app.use((err, req, res, next) => {
  errorHandler(err, res);
});

// Start the server
const server = app.listen(8080, error => {
  if (error) {
    console.log("Error running Express");
  }
  console.log("Server is running on port", server.address().port);
});
