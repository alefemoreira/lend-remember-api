const { User, Friend, Item, Lending } = require("../app/models");

module.exports = {
  async index(req, res) {
    const users = await User.findAll();

    return res.json(users);
  },

  async create(req, res) {
    const { name, email, password } = req.body;

    await User.create({
      name,
      email,
      password,
    });

    return res.json({ name });
  },

  async delete(req, res) {
    const id = req.userId;

    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(400).json({ message: `user does not exists` });
    }

    await Lending.destroy({ where: { user_id: id } });
    await Friend.destroy({ where: { user_id: id } });
    await Item.destroy({ where: { user_id: id } });
    await User.destroy({ where: { id } });

    return res.json({ message: `user ${id} was deleted` });
  },

  async update(req, res) {
    const id = req.userId;
    const { name, email, password } = req.body;

    let user = await User.findOne({ where: { id } });

    if (user) {
      user.set("name", name !== null ? name : user.name);
      user.set("email", email !== null ? email : user.email);
      user.set("password", password !== null ? password : user.password);

      user = await user.save();
    } else {
      return res.status(400).json({ message: `user does not exists` });
    }

    return res.json(user);
  },
};
