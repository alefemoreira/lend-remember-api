"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("lendings", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_user: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "users"
          },
          key: "id"
        },
        allowNull: false
      },
      id_item: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "items"
          },
          key: "id"
        },
        allowNull: false
      },
      id_friend: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "friends"
          },
          key: "id"
        },
        allowNull: false
      },
      lending_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      receive_date: {
        type: Sequelize.DATE
      },
      received: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("lendings");
  }
};
