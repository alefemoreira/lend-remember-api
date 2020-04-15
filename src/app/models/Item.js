module.exports = (Sequelize, DataTypes) => {
  const Item = Sequelize.define("Item", {
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    title: DataTypes.STRING,
    description: DataTypes.STRING,
  });

  return Item;
};
