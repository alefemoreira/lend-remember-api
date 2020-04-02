const bcrypt = require("bcryptjs");
const { User } = require("../app/models");

module.exports = {
  async create(req, res) {
    const { name, email, password } = req.body;

    password_hash = await bcrypt.hash(password, 8);

    const user = User.create({
      name,
      email,
      password_hash
    });

    return res.json({ name });
  }
};
