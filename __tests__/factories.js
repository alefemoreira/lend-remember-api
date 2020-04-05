const faker = require("faker");
const { factory } = require("factory-girl");
const { User } = require("../src/app/models");

factory.define("User", User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  passwor: faker.internet.password(),
});

module.exports = factory;
