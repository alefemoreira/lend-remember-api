const connection = require("../database/connection");
const checkPassword = require("../utils/checkPassword");

module.exports = {
  async create(req, res) {
    const { email, password } = req.body;

    const user = await connection("users")
      .select("*")
      .where("email", email)
      .first();

    console.log("HEY 1");

    if (!user) {
      return res.status(400).json({ error: "No User found with this email" });
    }

    console.log("HEY 2");

    if (await checkPassword(password, user.password_hash)) {
      console.log("HEY 3");
      return res.json(user);
    } else {
      return res.status(401).json({ error: "Sorry, invalid password" });
    }
  },
};
