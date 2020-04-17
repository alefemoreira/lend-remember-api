const truncate = require("../utils/truncate");
const app = require("../../src/app");
const request = require("supertest");
const { Friend, Item } = require("../../src/app/models");
const { createUser, createFriend, createItem } = require("../utils/factories");

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

  it("should be able to show the total of friends registered of user", async () => {
    const user = await createUser();
    const friendsOfUser = Array();

    for (i = 0; i < 6; i++) {
      friendsOfUser.push(await createFriend(user));
    }

    await createFriend(await createUser());

    let response = await request(app)
      .get("/friends?page=1")
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.header["x-total-count"]).toBe(String(friendsOfUser.length));
    expect(response.status).toBe(200);
  });

  it("should be able to list the first 5 friends of User", async () => {
    const user = await createUser();

    for (i = 0; i < 6; i++) {
      await createFriend(user);
    }

    await createFriend(await createUser());

    const response = await request(app)
      .get(`/friends?page=1`)
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.body.length).toBe(5);
    expect(response.status).toBe(200);
  });

  it("should be able to list all friends, show through pages, maximum 5 per page", async () => {
    const user = await createUser();
    const FRIENDS_QUANTITY = 12;
    const friendsOfUser = Array();
    let page = 0;
    let totalReceived = 0;

    for (i = 0; i < FRIENDS_QUANTITY; i++) {
      friendsOfUser.push(await createFriend(user));
    }

    while (totalReceived < FRIENDS_QUANTITY) {
      let expect_quantity = 5;
      const totalToReceive = FRIENDS_QUANTITY - totalReceived;
      page++;

      if (totalToReceive <= 5) {
        expect_quantity = totalToReceive;
      }

      const response = await request(app)
        .get(`/friends?page=${page}`)
        .set("authorization", `Bearer ${user.generateToken()}`);

      expect(response.body.length).toBe(expect_quantity);
      expect(response.status).toBe(200);

      totalReceived += expect_quantity;
    }
  });
});

describe("Item", () => {
  beforeEach(async () => {
    await truncate();
  });

  afterEach(async () => {
    await Item.destroy({ truncate: true, force: true });
  });

  it("should be able to show the total of items registered of user", async () => {
    const user = await createUser();
    const user2 = await createUser();
    const itemsOfUser = Array();

    for (i = 1; i < 6; i++) {
      itemsOfUser.push(await createItem(user));
    }

    const itemOfUser2 = await createItem(user2);

    let response = await request(app)
      .get("/items?page=1")
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.header["x-total-count"]).toBe(String(itemsOfUser.length));
    expect(response.status).toBe(200);
  });

  it("should be able to list the first 5 items of User", async () => {
    const user = await createUser();
    const user2 = await createUser();
    const itemsOfUser = Array();

    for (i = 1; i < 6; i++) {
      itemsOfUser.push(await createItem(user));
    }

    const itemOfUser2 = await createItem(user2);

    let response = await request(app)
      .get("/items?page=1")
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.header["x-total-count"]).toBe(String(itemsOfUser.length));
    expect(response.body.length).toBe(5);
    expect(response.status).toBe(200);
  });

  it("should be able to list all items, show through pages, maximum 5 per page", async () => {
    const user = await createUser();
    const ITEMS_QUANTITY = 12;
    const items = Array();
    let totalReceived = 0;
    let page = 0;

    for (i = 0; i < ITEMS_QUANTITY; i++) {
      items.push(await createItem(user));
    }

    while (totalReceived < ITEMS_QUANTITY) {
      const totalToReceive = ITEMS_QUANTITY - totalReceived;
      let expect_quantity = 5;
      page++;

      if (totalToReceive <= 5) {
        expect_quantity = totalToReceive;
      }

      const response = await request(app)
        .get(`/items?page=${page}`)
        .set("authorization", `Bearer ${user.generateToken()}`);

      expect(response.body.length).toBe(expect_quantity);
      expect(response.status).toBe(200);

      totalReceived += expect_quantity;
    }
  });
});
