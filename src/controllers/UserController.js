const bcrypt = require("bcryptjs");
const connection = require("../database/connection");

module.exports = {
  async create(req, res) {
    const { name, email, password } = req.body;

    const password_hash = await bcrypt.hash(password, 8);
    console.log(password_hash);

    const user = await connection("users").insert({
      name,
      email,
      password_hash
    });

    console.log(user);

    return res.json({ name });
  },

  async delete(req, res) {
    const { email } = req.body;

    return res.status(200).send();
  }
};
