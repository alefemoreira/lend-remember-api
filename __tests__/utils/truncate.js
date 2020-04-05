const { sequelize } = require("../../src/app/models");

module.exports = () => {
  Object.values(sequelize.models).map(async (model) => {
    return await model.destroy({ where: {}, truncate: true, force: true });
  });
};
