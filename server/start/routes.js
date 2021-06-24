const users = require("../routers/users");
const auth = require("../routers/auth");

module.exports = function (app) {
  app.use("/api/users", users);
  app.use("/api/auth", auth);
};
