const { User, Friend, Item, Lending } = require("../app/models");

module.exports = {
  async index(req, res) {
    const user_id = req.userId;
    const { page = 1 } = req.query;

    const { count, rows } = await Lending.findAndCountAll({
      where: { user_id },
      limit: 5,
      offset: (page - 1) * 5,
      include: [
        { model: User, required: true, attributes: ["id", "name", "email"] },
        { model: Item, required: true, attributes: ["id", "title"] },
        { model: Friend, required: true, attributes: ["id", "name"] },
      ],
    });

    res.header("X-Total-Count", count);
    return res.json(rows);
  },

  async show(req, res) {
    const user_id = req.userId;
    const { id } = req.params;

    const lending = await Lending.findOne({
      where: { id, user_id },
      include: [
        { model: User, required: true, attributes: ["id", "name", "email"] },
        { model: Item, required: true, attributes: ["id", "title"] },
        { model: Friend, required: true, attributes: ["id", "name"] },
      ],
    });

    if (!lending) {
      return res.status(400).json({ error: "Lending does not exist" });
    }

    return res.json(lending);
  },

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
      return res.status(400).json({ message: "Item does not exist" });
    }

    if (!friend) {
      return res.status(400).json({ message: "Friend does not exist" });
    }

    if (item.user_id !== user_id) {
      return res
        .status(403)
        .json({ message: "Forbidden to use this item in your lending" });
    }

    if (friend.user_id !== user_id) {
      return res
        .status(403)
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

  async delete(req, res) {
    const user_id = req.userId;
    const { id } = req.params;

    const lending = await Lending.findOne({ where: { id } });

    if (!lending) {
      return res.status(400).json({ message: `lending does not exists` });
    }

    if (lending.user_id !== user_id) {
      return res
        .status(401)
        .json({ message: "Unauthorized to delete this item" });
    }

    await lending.destroy();

    return res.json({ message: `Lending ${lending.id} was deleted` });
  },

  async update(req, res) {
    const user_id = req.userId;
    const { id } = req.params;
    const {
      friend_id,
      item_id,
      lending_date,
      receive_date,
      received,
    } = req.body;

    let lending = await Lending.findOne({ where: { id } });

    if (!lending) {
      return res.status(400).json({ message: `lending does not exists` });
    }

    if (lending.user_id !== user_id) {
      return res
        .status(403)
        .json({ message: "Forbidden to update this lending" });
    }

    lending.set(
      "friend_id",
      friend_id !== null ? friend_id : lending.friend_id
    );

    lending.set("item_id", item_id !== null ? item_id : lending.item_id);

    lending.set(
      "lending_date",
      lending_date !== null ? lending_date : lending.lending_date
    );

    lending.set(
      "receive_date",
      receive_date !== null ? receive_date : lending.receive_date
    );

    lending.set("received", received !== null ? received : lending.received);

    lending = await lending.save();

    return res.json(lending);
  },
};
