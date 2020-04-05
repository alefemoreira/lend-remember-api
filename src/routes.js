const routes = require("express").Router();
const UserController = require("./controllers/UserController");
const SessionController = require("./controllers/SessionController");

routes.post("/users", UserController.create);

routes.post("/sessions", SessionController.create);

module.exports = routes;
