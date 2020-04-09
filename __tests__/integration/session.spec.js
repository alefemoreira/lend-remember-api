const truncate = require("../utils/truncate");
const app = require("../../src/app");
const request = require("supertest");
const { User } = require("../../src/app/models");
const faker = require("faker");

describe("User", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should authenticate with valid credentials", async () => {
    const email = faker.internet.email();
    const password = "123456";

    const user = await User.create({
      name: faker.name.findName(),
      email,
      password,
    });

    const response = await request(app).post("/sessions").send({
      email,
      password,
    });

    expect(response.status).toBe(200);
  });

  it("should not authenticate with invalid email", async () => {
    const user = await User.create({
      name: faker.name.findName(),
      email: "teste@gmail.com",
      password: "123456",
    });

    const response = await request(app).post("/sessions").send({
      email: "delimaalefe@hotmail.com",
      password: "123456",
    });

    expect(response.body).toHaveProperty("error");
    expect(response.status).toBe(400);
  });

  it("should not authenticate with invalid credentials", async () => {
    const user = await User.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: "123456",
    });

    const response = await request(app).post("/sessions").send({
      email: user.email,
      password: "123123",
    });

    expect(response.body).toHaveProperty("error");
    expect(response.status).toBe(401);
  });

  it("shoud return JWT token when authenticate", async () => {
    const user = await User.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: "123456",
    });

    const response = await request(app).post("/sessions").send({
      email: user.email,
      password: user.password,
    });

    expect(response.body).toHaveProperty("token");
    expect(response.status).toBe(200);
  });

  it("should be able to access private routes when authenticated", async () => {
    const user = await User.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: "123456",
    });

    const response = await request(app)
      .delete("/users")
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });

  it("should not be able to access private routes without jwt token", async () => {
    const user = await User.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: "123456",
    });

    const response = await request(app).delete("/users");

    expect(response.status).toBe(401);
  });

  it("should not be able to access private routes with invalid jwt token", async () => {
    const user = await User.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: "123456",
    });

    const response = await request(app)
      .delete("/users")
      .set("Authorization", `Bearer 123123`);

    expect(response.status).toBe(401);
  });
});
