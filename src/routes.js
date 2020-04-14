const routes = require("express").Router();
const authMiddleware = require("./app/middlewares/auth");

const FriendController = require("./controllers/FriendController");
const UserController = require("./controllers/UserController");
const SessionController = require("./controllers/SessionController");

routes.post("/users", UserController.create);
routes.post("/sessions", SessionController.create);

routes.use(authMiddleware);

routes.delete("/users", UserController.delete);
routes.put("/users", UserController.update);
routes.get("/users", UserController.index);

routes.post("/friends", FriendController.create);
routes.get("/friends", FriendController.index);
routes.put("/friends/:id", FriendController.update);
routes.delete("/friends/:id", FriendController.delete);

module.exports = routes;
