"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("lendings", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
      },
      item_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "items",
          key: "id",
        },
        allowNull: false,
      },
      friend_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "friends",
          key: "id",
        },
        allowNull: false,
      },
      lending_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      receive_date: {
        type: Sequelize.DATE,
      },
      received: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("lendings");
  },
};
