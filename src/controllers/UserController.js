const { User } = require("../app/models");

module.exports = {
  async create(req, res) {
    const { name, email, password } = req.body;

    User.create({
      name,
      email,
      password,
    });

    return res.json({ name });
  },
};
