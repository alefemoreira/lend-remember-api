module.exports = (Sequelize, DataTypes) => {
  const Friend = Sequelize.define("Friend", {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    whatsapp: DataTypes.STRING,
  });

  return Friend;
};
