const { User, Item } = require("../app/models");

module.exports = {
  async index(req, res) {},
  async create(req, res) {
    const user_id = req.userId;
    const { title, description } = req.body;

    const { id } = await Item.create({
      user_id,
      title,
      description: description || "",
    });

    return res.json({ id });
  },

  async delete(req, res) {
    const user_id = req.userId;
    const { id } = req.params;

    const item = await Item.findOne({ where: { id, user_id } });

    if (!item) {
      return res.status(400).json({ message: `item does not exists` });
    }

    await Item.destroy({ where: { id, user_id } });

    return res.json({ message: `item ${item.id} was deleted` });
  },

  async update(req, res) {
    const { title, description } = req.body;

    let body = {
      title: title || "",
      description: description || "",
    };

    return res.json(body);
  },
};
