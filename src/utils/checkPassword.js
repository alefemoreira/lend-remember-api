const bcrypt = require("bcryptjs");

module.exports = async function checkPassword(password, password_hash) {
  return await bcrypt.compare(password, password_hash);
};
