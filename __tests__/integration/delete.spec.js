const faker = require("faker");
const truncate = require("../utils/truncate");
const app = require("../../src/app");
const request = require("supertest");
const { User } = require("../../src/app/models");

describe("User", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should be able to delete a user when authenticated", async () => {
    let user = await User.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    const response = await request(app)
      .delete("/users")
      .set("authorization", `Bearer ${user.generateToken()}`);

    user = await User.findOne({ where: { id: user.id } });

    expect(user).toBe(null);
    expect(response.status).toBe(200);
  });

  it("should not be able to delete a user, if he is not exists", async () => {
    const user = await User.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    const token = user.generateToken();

    await User.destroy({ where: { id: user.id } });

    const response = await request(app)
      .delete("/users")
      .set("authorization", `Bearer ${token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(400);
  });
});
