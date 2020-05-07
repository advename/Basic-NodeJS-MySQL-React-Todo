const { CustomError } = require(__dirname + "/error.js");
/**
 * Custom Authenticator helper
 */
function isAuthenticated(req, res, next) {
  try {
    if (req.session.user) {
      console.log("Authenticated");
      next();
    } else {
      throw new CustomError(403, "Unauthorized");
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { isAuthenticated };
