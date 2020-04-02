const { User, Friend, Item, Lending } = require("../../src/app/models");
const app = require("../../src/app");
const truncate = require("../utils/truncate");
const request = require("supertest");

describe("Register", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("Should receive the name, email and password of new user and register him", async () => {
    const body = {
      name: "Àlefe de Lima Moreira",
      email: "delimaalefe@gmail.com",
      password: "123456"
    };

    const response = await request(app)
      .post("/users")
      .send(body);

    expect(response.body).toHaveProperty("name");
    expect(response.status).toBe(200);
  });
});
