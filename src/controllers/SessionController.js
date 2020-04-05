const { User } = require("../app/models");
module.exports = {
  async create(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: "No User found with this email" });
    }

    if (!(await user.checkPassword(password, user.password_hash))) {
      return res.status(401).json({ error: "Sorry, invalid password" });
    }

    return res.json({
      user,
      token: user.generateToken(),
    });
  },
};
