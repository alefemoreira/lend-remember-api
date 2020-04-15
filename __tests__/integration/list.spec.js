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

  afterEach(async () => {
    await Friend.destroy({ truncate: true, force: true });
  });

  it("should be able to list the 5 first friends of User and show the total of friends register", async () => {
    const user = await createUser();
    const user2 = await createUser();
    const friends = [
      await createFriend(user),
      await createFriend(user),
      await createFriend(user),
      await createFriend(user),
      await createFriend(user),
      await createFriend(user),
      await createFriend(user2),
    ];

    const response = await request(app)
      .get("/friends?page=1")
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.header).toHaveProperty("x-total-count");
    expect(response.header["x-total-count"]).toBe("6");
    expect(response.body.length).toBe(5);
    expect(response.status).toBe(200);
  });
});
