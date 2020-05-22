const { User, Item, Lending } = require("../app/models");

module.exports = {
  async index(req, res) {
    const user_id = req.userId;
    const { page = 1 } = req.query;

    const { count, rows } = await Item.findAndCountAll({
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

    await Lending.destroy({ where: { item_id: id } });
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

    if (item.user_id !== user_id) {
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
