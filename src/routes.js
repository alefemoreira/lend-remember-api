const routes = require("express").Router();
const { celebrate, Segments, Joi } = require("celebrate");
const authMiddleware = require("./app/middlewares/auth");

const FriendController = require("./controllers/FriendController");
const ItemController = require("./controllers/ItemController");
const LendingController = require("./controllers/LendingController");
const SessionController = require("./controllers/SessionController");
const UserController = require("./controllers/UserController");

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

routes.post("/items", ItemController.create);
routes.get("/items", ItemController.index);
routes.put("/items/:id", ItemController.update);
routes.delete("/items/:id", ItemController.delete);

routes.post(
  "/lendings",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      friend_id: Joi.number().integer().required(),
      item_id: Joi.number().integer().required(),
      lending_date: Joi.date().required(),
      receive_date: Joi.date(),
      received: Joi.boolean(),
    }),
  }),
  LendingController.create
);
routes.get("/lendings", LendingController.index);
routes.put("/lendings/:id", LendingController.update);
routes.delete("/lendings/:id", LendingController.delete);

module.exports = routes;
