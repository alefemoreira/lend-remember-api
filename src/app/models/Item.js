module.exports = (Sequelize, DataTypes) => {
  const Item = Sequelize.define("Item", {
    title: DataTypes.STRING,
    description: DataTypes.STRING
  });

  return Item;
};
