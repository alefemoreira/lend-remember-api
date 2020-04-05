const routes = require("express").Router();
const UserController = require("./controllers/UserController");

const authMiddleware = require("./app/middlewares/auth");

const SessionController = require("./controllers/SessionController");

routes.post("/users", UserController.create);

routes.post("/sessions", SessionController.create);

routes.use(authMiddleware);

routes.delete("/users", (req, res) => {
  return res.status(200).send();
});

module.exports = routes;
