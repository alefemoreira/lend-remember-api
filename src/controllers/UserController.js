const bcrypt = require("bcryptjs");
const connection = require("../database/connection");

module.exports = {
  async create(req, res) {
    const { name, email, password } = req.body;

    const password_hash = await bcrypt.hash(password, 8);

    const user = await connection("users").insert({
      name,
      email,
      password_hash
    });

    return res.json({ name });
  },

  async delete(req, res) {
    const { email } = req.body;

    return res.status(200).send();
  }
};
