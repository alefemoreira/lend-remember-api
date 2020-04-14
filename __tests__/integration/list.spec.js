const truncate = require("../utils/truncate");
const app = require("../../src/app");
const request = require("supertest");
const faker = require("faker");
const { User, Friend } = require("../../src/app/models");
const { createUser, createFriend } = require("../utils/factories");

describe("User", () => {
  beforeEach(async () => {
    await truncate();
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

describe("Friend", () => {
  beforeEach(async () => {
    await truncate();
  });

  /*it("should be able to list the 5 first friends of User", async () => {
    const user = await createUser();
    const friend = await Friend.create({
      user_id: user.id,
      name: faker.name.findName(),
      email: faker.internet.email(),
      whatsapp: faker.phone.phoneNumber(),
    });

    const response = await request(app)
      .get("/friends?page=1")
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });*/
});
