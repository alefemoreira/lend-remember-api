const truncate = require("../utils/truncate");
const app = require("../../src/app");
const request = require("supertest");
const { User } = require("../../src/app/models");
const faker = require("faker");
const { createUser } = require("../utils/factories");

describe("User", () => {
  beforeEach(async () => {
    await truncate();
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

describe("Friends", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should be able to create a new user", async () => {
    const user = await createUser();

    const body = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      whatsapp: faker.phone.phoneNumber(),
    };

    const response = await request(app)
      .post("/friends")
      .send(body)
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });
});
