const faker = require("faker");
const { User } = require("../../src/app/models");

module.exports = {
  async createUser(properties = {}) {
    const user = await User.create({
      name: properties.name || faker.name.findName(),
      email: properties.email || faker.internet.email(),
      password: properties.password || faker.internet.password(),
    });

    return user;
  },
};
