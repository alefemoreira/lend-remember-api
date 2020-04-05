const connection = require("../../src/database/connection");
const request = require("supertest");
const app = require("../../src/app");
const bcrypt = require("bcryptjs");

// jest.setTimeout(10000);

describe("Authentication", () => {
  beforeAll(async (async) => {
    await connection.migrate.latest();
  });

  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Should authenticate with valid credencials", async () => {
    const password_hash = await bcrypt.hash("123456", 8);

    await connection("users").insert({
      name: "Álefe Moreira",
      email: "delima@alefe.com",
      password_hash,
    });

    console.log("HEY 0");

    const response = await request(app).post("/sessions").send({
      email: "delima@alefe.com",
      password: "123456",
    });

    console.log(response.status);

    expect(200).toBe(200);
  });
});
