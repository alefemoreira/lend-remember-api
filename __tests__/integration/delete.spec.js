const faker = require("faker");
const truncate = require("../utils/truncate");
const app = require("../../src/app");
const request = require("supertest");
const { User, Friend, Item } = require("../../src/app/models");
const { createUser, createFriend, createItem } = require("../utils/factories");

describe("User", () => {
  beforeEach(async () => {
    await truncate();
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

describe("Friend", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should be able to delete a existent friend", async () => {
    const user = await createUser();
    const friend = await createFriend(user);

    const response = await request(app)
      .delete(`/friends/${friend.id}`)
      .set("authorization", `Bearer ${user.generateToken()}`);

    const { count, rows } = await Friend.findAndCountAll({
      where: { id: friend.id },
    });

    expect(count).toBe(0);
    expect(response.status).toBe(200);
  });

  it("should not be able to delete a nonexistent friend", async () => {
    const user = await createUser();
    let friend = await createFriend(user);

    await Friend.destroy({ where: { id: friend.id } });

    const response = await request(app)
      .delete(`/friends/${friend.id}`)
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(400);
  });

  it("should not be able to delete a friend of other user", async () => {
    const user = await createUser();
    const user2 = await createUser();
    let friend = await createFriend(user2);

    const response = await request(app)
      .delete(`/friends/${friend.id}`)
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(401);
  });
});

describe("Item", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should be able to delete a existent item", async () => {
    const user = await createUser();
    const item = await createItem(user);

    const response = await request(app)
      .delete(`/items/${item.id}`)
      .set("authorization", `Bearer ${user.generateToken()}`);

    const { count } = await Item.findAndCountAll({
      where: { id: item.id, user_id: user.id },
    });

    expect(count).toBe(0);
    expect(response.status).toBe(200);
  });

  it("should not be able to delete a nonexistent item", async () => {
    const user = await createUser();
    const item = await createItem(user);

    await Item.destroy({ where: { id: item.id } });

    const response = await request(app)
      .delete(`/items/${item.id}`)
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(400);
  });

  it("should not be able to delete a item of other user", async () => {
    const user = await createUser();
    const user2 = await createUser();
    const item = await createItem(user2);

    const response = await request(app)
      .delete(`/items/${item.id}`)
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(401);
  });
});
