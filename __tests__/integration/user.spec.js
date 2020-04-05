const { User } = require("../../src/app/models");
const truncate = require("../utils/truncate");
const app = require("../../src/app");
const request = require("supertest");

describe("User", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("Should receive the name, email and password for create a new user", async () => {
    const response = await request(app).post("/users").send({
      name: "Álefe Moreira",
      email: "delimaalefe@gmail.com",
      password: "123456",
    });

    expect(response.body).toHaveProperty("name");
    expect(response.status).toBe(200);
  });

  it("Should storage hash of user password ", async () => {
    const response = await request(app).post("/users").send({
      name: "Álefe Moreira",
      email: "delimaalefe@gmail.com",
      password: "123456",
    });

    const user = await User.findOne({
      where: { email: "delimaalefe@gmail.com" },
    });

    const checkPassword = await user.checkPassword("123456");

    expect(checkPassword).toBe(true);
    expect(response.status).toBe(200);
  });
});
