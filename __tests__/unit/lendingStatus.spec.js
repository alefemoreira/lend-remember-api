const { User, Friend, Item, Lending } = require("../app/models");
const operator = require("sequelize").Op;

module.exports = {
  async received(user_id) {
    const { count, rows } = await Lending.findAndCountAll({
      where: { user_id, received: true },
      include: [
        { model: User, required: true, attributes: ["name", "email"] },
        { model: Item, required: true, attributes: ["title"] },
        { model: Friend, required: true, attributes: ["name"] },
      ],
    });

    return { count, rows };
  },

  async late(user_id) {
    const { count, rows } = await Lending.findAndCountAll({
      where: {
        user_id,
        received: false,
        receive_date: {
          [operator.lt]: "2020-05-30",
        },
      },
      include: [
        { model: User, required: true, attributes: ["name", "email"] },
        { model: Item, required: true, attributes: ["title"] },
        { model: Friend, required: true, attributes: ["name"] },
      ],
    });

    return { count, rows };
  },

  async to_receive(user_id) {
    const { count, rows } = await Lending.findAndCountAll({
      where: {
        user_id,
        received: false,
        receive_date: {
          [operator.gte]: "2020-05-30",
        },
      },
      include: [
        { model: User, required: true, attributes: ["name", "email"] },
        { model: Item, required: true, attributes: ["title"] },
        { model: Friend, required: true, attributes: ["name"] },
      ],
    });

    return { count, rows };
  },
};
