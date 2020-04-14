module.exports = (Sequelize, DataTypes) => {
  const Lending = Sequelize.define("Lending", {
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    item_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "items",
        key: "id",
      },
    },
    friend_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "friends",
        key: "id",
      },
    },
    lending_date: DataTypes.DATE,
    receive_date: DataTypes.DATE,
    received: DataTypes.BOOLEAN,
  });

  return Lending;
};
