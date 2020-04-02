const User = require("./User");
const Friend = require("./Friend");
const Item = require("./Item");

module.exports = (Sequelize, DataTypes) => {
  const Lending = Sequelize.define("Lending", {
    id_user: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id"
      }
    },
    id_item: {
      type: DataTypes.INTEGER,
      references: {
        model: "items",
        key: "id"
      }
    },
    id_friend: {
      type: DataTypes.INTEGER,
      references: {
        model: "friends",
        key: "id"
      }
    },
    lending_date: DataTypes.DATE,
    receive_date: DataTypes.DATE,
    received: DataTypes.BOOLEAN
  });

  return Lending;
};
