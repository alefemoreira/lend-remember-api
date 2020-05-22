const { User, Friend, Lending } = require("../app/models");

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
    const user_id = req.userId;
    const { id } = req.params;

    const friend = await Friend.findOne({ where: { id } });

    if (!friend) {
      return res.status(400).json({ message: `friend does not exists` });
    }

    if (friend.user_id !== user_id) {
      return res
        .status(401)
        .json({ message: `Unauthorized to delete this friend` });
    }

    await Lending.destroy({ where: { friend_id: id } });
    await Friend.destroy({ where: { id, user_id } });

    return res.json({ message: `Friend ${friend.id} was deleted` });
  },

  async update(req, res) {
    const user_id = req.userId;
    const { id } = req.params;
    const { name, email, whatsapp } = req.body;

    let friend = await Friend.findOne({ where: { id } });

    if (!friend) {
      return res.status(400).json({ message: `friend does not exists` });
    }

    if (friend.user_id != user_id) {
      //TESTAR
      return res
        .status(401)
        .json({ message: `Unauthorized to update this friend` });
    }

    friend.set("name", name !== null ? name : friend.name);
    friend.set("email", email !== null ? email : friend.email);
    friend.set("whatsapp", whatsapp !== null ? whatsapp : friend.whatsapp);

    friend = await friend.save();

    return res.json(friend);
  },
};
