module.exports = (Sequelize, DataTypes) => {
  const User = Sequelize.define("User", {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    // password: DataTypes.VIRTUAL,
    password_hash: DataTypes.STRING
  });

  return User;
};
