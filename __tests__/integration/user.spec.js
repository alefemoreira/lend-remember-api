const shell = require("shelljs");
const truncate = require("../utils/truncate");
const app = require("../../src/app");
const request = require("supertest");
const { User } = require("../../src/app/models");
const faker = require("faker");
const { createUser } = require("../utils/factories");

describe("Create User", () => {
  beforeEach(async () => {
    await truncate();
  });

  afterEach(async () => {
    await User.destroy({ truncate: true, force: true });
  });

  it("Should receive the name, email and password for create a new user", async () => {
    const response = await request(app).post("/users").send({
      name: "Álefe Moreira",
      email: faker.internet.email(),
      password: "123456",
    });

    expect(response.body).toHaveProperty("name");
    expect(response.status).toBe(200);
  });

  it("Should storage hash of user password ", async () => {
    const email = faker.internet.email();

    const response = await request(app).post("/users").send({
      name: "Álefe Moreira",
      email,
      password: "123456",
    });

    const user = await User.findOne({
      where: { email },
    });

    const checkPassword = await user.checkPassword("123456");

    expect(checkPassword).toBe(true);
    expect(response.status).toBe(200);
  });
});

describe("List User", () => {
  beforeEach(async () => {
    await truncate();
  });

  afterEach(async () => {
    await User.destroy({ truncate: true, force: true });
  });

  it("should be able to list all users", async () => {
    const user = await createUser();
    await createUser();
    await createUser();

    const response = await request(app)
      .get("/users")
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });
});

describe("Update User", () => {
  beforeEach(async () => {
    await truncate();
  });

  afterEach(async () => {
    await User.destroy({ truncate: true, force: true });
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
      .set("authorization", `Bearer ${user.generateToken()}`)
      .send({ name });

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
      .set("authorization", `Bearer ${user.generateToken()}`)
      .send({ email });

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
      .set("authorization", `Bearer ${user.generateToken()}`)
      .send({ password });

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
      .set("authorization", `Bearer ${user.generateToken()}`)
      .send({
        name,
        email,
        password,
      });

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
      .set("authorization", `Bearer ${user.generateToken()}`)
      .send({});

    expect(response.status).toBe(400);
  });

  it("nothing should be happen if not passing body or passing a void body", async () => {
    let user = await createUser();

    const response = await request(app)
      .put("/users")
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.body).not.toHaveProperty("name");
    expect(response.body).not.toHaveProperty("email");
    expect(response.body).not.toHaveProperty("password");
    expect(response.status).toBe(200);
  });
});

describe("Delete User", () => {
  beforeEach(async () => {
    await truncate();
  });

  afterEach(async () => {
    await User.destroy({ truncate: true, force: true });
  });

  it("should be able to delete a user when authenticated", async () => {
    let user = await User.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    user = await User.findOne({ where: { id: user.id } });

    expect(user).not.toBe(null);

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
