const routes = require("express").Router();

routes.get("/", (req, res) => {
  res.json({ Hello: "Word!!" }).status(200);
});

module.exports = routes;
