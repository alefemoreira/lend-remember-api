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

    const item = await Item.findOne({ where: { id } });

    if (!item) {
      return res.status(400).json({ message: `item does not exists` });
    }

    if (item.user_id !== user_id) {
      return res
        .status(401)
        .json({ message: `Unauthorized to delete this item` });
    }

    await Item.destroy({ where: { id } });

    return res.json({ message: `item ${item.id} was deleted` });
  },

  async update(req, res) {
    const user_id = req.userId;
    const { id } = req.params;
    const { title, description } = req.body;

    let item = await Item.findOne({ where: { id } });

    if (!item) {
      return res.status(400).json({ message: `item does not exists` });
    }

    if (item.user_id != user_id) {
      return res
        .status(401)
        .json({ message: `Unauthorized to update this item` });
    }

    item.set("title", title !== null ? title : item.title);
    item.set(
      "description",
      description !== null ? description : item.description
    );

    item = await item.save();

    return res.json(item);
  },
};
