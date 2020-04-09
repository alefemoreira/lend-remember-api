const faker = require("faker");
const truncate = require("../utils/truncate");
const app = require("../../src/app");
const request = require("supertest");
const { User } = require("../../src/app/models");

describe("User", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should be able to update name of user", async () => {
    let user = await User.create({
      name: "Lima",
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    const name = "Álefe de Lima Moreira";

    const response = await request(app)
      .put("/users")
      .send({
        name,
      })
      .set("authorization", `Bearer ${user.generateToken()}`);

    user = await User.findOne({ where: { id: user.id } });

    expect(response.body.name).toBe(name);
    expect(response.status).toBe(200);
  });

  it("should be able to update email of user", async () => {
    let user = await User.create({
      name: faker.name.findName(),
      email: "alefe@gmail.com",
      password: faker.internet.password(),
    });

    const email = "delimaalefe@gmail.com";

    const response = await request(app)
      .put("/users")
      .send({
        email,
      })
      .set("authorization", `Bearer ${user.generateToken()}`);

    user = await User.findOne({ where: { id: user.id } });

    expect(response.body.email).toBe(email);
    expect(response.status).toBe(200);
  });

  it("should be able to update password of user", async () => {
    let user = await User.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: "123456",
    });

    const password = "123123";

    const response = await request(app)
      .put("/users")
      .send({
        password,
      })
      .set("authorization", `Bearer ${user.generateToken()}`);

    user = await User.findOne({ where: { id: user.id } });

    expect(response.body.password).toBe(password);
    expect(response.status).toBe(200);
  });

  it("should be able to update all informations of user", async () => {
    let user = await User.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    const name = "Álefe de Lima Moreira";
    const email = "delimaalefe@gmail.com";
    const password = "123123";

    const response = await request(app)
      .put("/users")
      .send({
        name,
        email,
        password,
      })
      .set("authorization", `Bearer ${user.generateToken()}`);

    user = await User.findOne({ where: { id: user.id } });

    expect(response.body.name).toBe(name);
    expect(response.body.email).toBe(email);
    expect(response.body.password).toBe(password);
    expect(response.status).toBe(200);
  });

  it("should not be able to update a nonexistent user ", async () => {
    let user = await User.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    token = user.generateToken();

    User.destroy({ where: { id: user.id } });

    const response = await request(app)
      .put("/users")
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(400);
  });
});
