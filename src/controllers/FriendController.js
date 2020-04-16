const { User, Friend } = require("../app/models");

module.exports = {
  async index(req, res) {
    const user_id = req.userId;
    const { page = 1 } = req.query;

    const { count, rows } = await Friend.findAndCountAll({
      where: { user_id },
      limit: 5,
      offset: (page - 1) * 5,
      include: [
        { model: User, required: true, attributes: ["id", "name", "email"] },
      ],
    });

    res.header("X-Total-Count", count);
    return res.json(rows);
  },

  async create(req, res) {
    const user_id = req.userId;
    const { name, email, whatsapp } = req.body;

    const { id } = await Friend.create({
      user_id,
      name,
      email: email || "",
      whatsapp: whatsapp || "",
    });

    return res.json({ id });
  },

  async delete(req, res) {
    const { id } = req.params;

    const friend = await Friend.findOne({ where: { id } });

    if (!friend) {
      return res.status(400).json({ message: `friend does not exists` });
    }

    await Friend.destroy({ where: { id } });

    return res.json({ message: `Friend ${friend.id} was deleted` });
  },

  async update(req, res) {
    const { id } = req.params;
    const { name, email, whatsapp } = req.body;

    let friend = await Friend.findOne({ where: { id } });

    if (!friend) {
      return res.status(400).json({ message: `friend does not exists` });
    }

    friend.set("name", name !== null ? name : friend.name);
    friend.set("email", email !== null ? email : friend.email);
    friend.set("whatsapp", whatsapp !== null ? whatsapp : friend.whatsapp);

    friend = await friend.save();

    return res.json(friend);
  },
};