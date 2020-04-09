const { sequelize, models } = require("../../src/app/models");
const { User, Friend, Lending, Item } = require("../../src/app/models/");

module.exports = async () => {
  await User.destroy({ truncate: true, force: true });
  await Friend.destroy({ truncate: true, force: true });
  await Lending.destroy({ truncate: true, force: true });
  await Item.destroy({ truncate: true, force: true });
  // Object.values(sequelize.models).map(async function (model) {
  //   return await model.destroy({ truncate: true, force: true });
  // });
};
