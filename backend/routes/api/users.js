const express = require("express");
const router = express.Router();
const User = require(__dirname + "/../../models/User.js"); // Extra: Import the User
const bcrypt = require("bcrypt");
const { isAuthenticated } = require(__dirname + "/../../helpers/auth.js");
const crypto = require("crypto");
const moment = require("moment");
const { CustomError } = require(__dirname + "/../../helpers/error.js");
const sendMail = require(__dirname + "/../../helpers/mail.js");

/**
 * Get the current logged in user details, except hashed password of course
 */
router.get("/", isAuthenticated, async (req, res, next) => {
  const user = await User.query()
    .select("username", "email")
    .findById(req.session.user.id)
    .throwIfNotFound();
  res.json(user);
});

/**
 * Check if the current user is logged in, e.g. has a running session
 * (This can and should only be checked backend wise)
 */
router.get("/is-authenticated", async (req, res, next) => {
  try {
    if (!req.session.user.id) {
      throw new CustomError(404, "Unauthenticated");
    }
    res.json({ message: "Authenticated" });
  } catch (err) {
    next(err);
  }
});

/**
 * Logout an user -> desroy session
 */
router.get("/logout", async (req, res, next) => {
  try {
    req.session.destroy(err => {
      if (err) throw new CustomError(500, "Unable to logout");
      res.json({ message: "Success" });
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Create a new user
 */
router.post("/", async (req, res, next) => {
  // req.body contains the JSON

  const { username, email, password, confirm_password } = req.body; // destructure username, email password and confirm_password out of the sent JSON

  // Check both passwords match
  if (password != confirm_password) {
    return res.status(400).json({ message: "Passwords did not match" });
  }

  // Check if username or email are already taken
  const userExists = await User.query()
    .where("username", username)
    .orWhere("email", email);

  if (userExists.length) {
    return res.status(400).json({ message: "Username or email already taken" });
  }

  // All good - try to create the user
  try {
    const user = await User.query().insert({ username, email, password }); //instead of username:username, can we use name once. This assigns a key with the name of the variable to the value of the variable.
    res.json({ user, message: "User created" });
  } catch (err) {
    next(err);
  }
});

/**
 * Login an existing user and start a session
 */
router.post("/login/", async (req, res, next) => {
  const { username, password } = req.body; // destructure username and password out of the sent JSON
  // Check if values exist
  if (username && password) {
    // Check if user exists. Remember, this must be async/await
    const user = await User.query().findOne({ username: username });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Invalid user/password combination" });
    }

    // User exists, check passwords
    await bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Validation Error" });
      }
      if (!result) {
        return res
          .status(404)
          .send({ message: "Invalid user/password combination" });
      } else {
        req.session.user = { username: user.username, id: user.id };
        return res.json({ message: "Successfully authenticated" });
      }
    });
  } else {
    res.status(404).json({ message: "Missing username or password" });
  }
});

/**
 * Delete the current logged in user
 */
router.delete("/", isAuthenticated, async (req, res, next) => {
  try {
    const user = await User.query().deleteById(req.session.user.id);
    if (user) {
      res.json({
        message: `User ${req.session.username} successfully deleted`
      });
    } else {
      res.json({
        message: `Error deleting the user`
      });
    }
  } catch (err) {
    next(err);
  }
});

/**
 * Request a password reset with a link + one-time-token sent via email
 */
router.post("/recovery/request/", async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.query()
      .findOne({ email })
      .throwIfNotFound(); // throws an NotFoundError if the user could not be found

    // Create cryptographical reset token (DO NOT use random numbers for reset token - they are too predictable)
    let recover_password_token = crypto.randomBytes(32).toString("hex");
    const lifetime = 24; //hours until expire
    let recover_password_exp_date = moment()
      .add(lifetime, "hours")
      .format("YYYY-MM-DD HH:mm:ss");
    console.log("Recovery token: " + recover_password_token);
    await user.$query().patch({
      recover_password_token,
      recover_password_active: true,
      recover_password_exp_date
    });

    //
    // Do recovery email sending stuff
    //

    const emailBody = `Hello ${user.username},

    Your account password token is ${recover_password_token}
    This token is valid only within ${lifetime} hours.
    `;
    console.log("EMIAAAALA");
    const emailSent = await sendMail(
      "develop.kiwi@gmail.com",
      "Password reset",
      emailBody
    );

    if (!emailSent) {
      throw new CustomError(502, "Email not sent");
    }

    res.json({ message: "Recovery email sent" });
  } catch (err) {
    next(err);
  }
});

/**
 * Use the password recovery details to change the password
 */
router.post("/recovery/", async (req, res, next) => {
  const { id, token, password, confirm_password } = req.body;
  try {
    // Check if data exists
    if (!id && !token && !password && !confirm_password) {
      throw new CustomError(400, "Invalid data");
    }

    // Check both passwords match
    if (password != confirm_password) {
      throw new CustomError(400, "Passwords did not match");
    }

    // Data exists and is valid, continue with token check and update if valid

    const user = await User.query()
      .findById(id)
      .throwIfNotFound(); // throws an NotFoundError if the user could not be found

    if (token != user.recover_password_token) {
      throw new CustomError(400, "Invalid token");
    }
    if (!user.recover_password_active) {
      throw new CustomError(403, "Forbidden access");
    }

    // Update password
    // promised based "fix" for bcrypt
    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, function(err, hash) {
        if (err) reject(err);
        resolve(hash);
      });
    });

    const passwordUpdate = await user.$query().patch({
      password: hashedPassword,
      recover_password_active: false
    });
    res.json({ message: "Password changed" });
  } catch (err) {
    next(err);
  }
});

// Export to api.js
module.exports = router;
