module.exports = (Sequelize, DataTypes) => {
  const Friend = Sequelize.define("Friend", {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    whatsapp: DataTypes.STRING
  });

  //Future feature: adress, show on map

  return Friend;
};
