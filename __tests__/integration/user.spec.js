const connection = require("../../src/database/connection");
const request = require("supertest");
const app = require("../../src/app");
const bcrypt = require("bcryptjs");

describe("Register User", () => {
  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should receive an name, email and password for register an user", async () => {
    const response = await request(app)
      .post("/users")
      .send({
        name: "Álefe Moreira",
        email: "delimaalefe@gmail.com",
        password: "123456"
      });

    expect(response.body).toHaveProperty("name");
    expect(response.status).toBe(200);
  });

  it("Should storage hash of user password ", async () => {
    const password = "123456";
    const email = "delimaalefe@gmail.com";

    const response = await request(app)
      .post("/users")
      .send({
        name: "Álefe Moreira",
        email,
        password
      });

    const user = await connection("users")
      .select("*")
      .where("email", email)
      .first();

    const compareHash = await bcrypt.compare(password, user.password_hash);

    expect(compareHash).toBe(true);
    expect(response.status).toBe(200);
  });
});
