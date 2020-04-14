// const { User } = require("./User");

module.exports = (Sequelize, DataTypes) => {
  const Friend = Sequelize.define("Friend", {
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    whatsapp: DataTypes.STRING,
  });

  return Friend;
};
