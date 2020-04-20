const { Friend, Item, Lending } = require("../app/models");

module.exports = {
  async index(req, res) {},
  async create(req, res) {
    const user_id = req.userId;
    const {
      friend_id,
      item_id,
      lending_date,
      receive_date,
      received,
    } = req.body;

    const item = await Item.findOne({ where: { id: item_id } });
    const friend = await Friend.findOne({ where: { id: friend_id } });

    if (!item) {
      return res.send(400).json({ message: "Item does not exist" });
    }

    if (!friend) {
      return res.send(400).json({ message: "Friend does not exist" });
    }

    if (item.user_id !== user_id) {
      return res
        .send(403)
        .json({ message: "Forbidden to use this item in your lending" });
    }

    if (friend.user_id !== user_id) {
      return res
        .send(403)
        .json({ message: "Forbidden to use this friend in your lending" });
    }

    const lending = await Lending.create({
      user_id,
      item_id,
      friend_id,
      lending_date,
      receive_date: receive_date || "0000-00-00",
      received: received || false,
    });

    return res.json({ id: lending.id });
  },
  async delete(req, res) {},
  async update(req, res) {},
};
