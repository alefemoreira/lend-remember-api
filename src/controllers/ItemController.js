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
  async delete(req, res) {},
  async update(req, res) {},
};
