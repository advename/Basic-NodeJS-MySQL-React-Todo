const bcrypt = require("bcrypt");

bcrypt.hash("hello", 10, function(err, hash) {
  console.log(hash);
});
