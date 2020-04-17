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
    const user2 = await createUser();

    const friendsOfUser = [
      await createFriend(user),
      await createFriend(user),
      await createFriend(user),
      await createFriend(user),
      await createFriend(user),
      await createFriend(user),
    ];

    const friendsOfUser2 = [await createFriend(user2)];

    const friends = [...friendsOfUser, ...friendsOfUser2];

    let response = await request(app)
      .get("/friends?page=1")
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.header["x-total-count"]).toBe(String(friendsOfUser.length));
    expect(response.status).toBe(200);
  });

  it("should be able to list the first 5 friends of User", async () => {
    const user = await createUser();
    const user2 = await createUser();

    const friendsUser = [
      await createFriend(user),
      await createFriend(user),
      await createFriend(user),
      await createFriend(user),
      await createFriend(user),
      await createFriend(user),
    ];
    const friendsUser2 = [await createFriend(user2)];

    const response = await request(app)
      .get(`/friends?page=1`)
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.body.length).toBe(5);
    expect(response.status).toBe(200);
  });

  it("should be able to list all friends, maximum 5 per page", async () => {
    const user = await createUser();
    const FRIENDS_QUANTITY = 12;
    let friendsUser = Array();

    for (i = 0; i < FRIENDS_QUANTITY; i++) {
      friendsUser.push(await createFriend(user));
    }
    let page = 1;
    let totalReceived = 0;

    while (totalReceived < FRIENDS_QUANTITY) {
      const totalToReceive = FRIENDS_QUANTITY - totalReceived;
      if (totalToReceive > 5) {
        const response = await request(app)
          .get(`/friends?page=${page}`)
          .set("authorization", `Bearer ${user.generateToken()}`);

        expect(response.body.length).toBe(5);
        expect(response.status).toBe(200);

        totalReceived += 5;
        page++;
      } else {
        const response = await request(app)
          .get(`/friends?page=${page}`)
          .set("authorization", `Bearer ${user.generateToken()}`);

        expect(response.body.length).toBe(totalToReceive);
        expect(response.status).toBe(200);

        totalReceived += totalToReceive;
      }
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

    const itemsOfUser = [
      await createItem(user),
      await createItem(user),
      await createItem(user),
      await createItem(user),
      await createItem(user),
      await createItem(user),
    ];

    const itemsofUser2 = [await createItem(user2)];

    const items = [...itemsOfUser, ...itemsofUser2];

    let response = await request(app)
      .get("/items?page=1")
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.header["x-total-count"]).toBe(String(itemsOfUser.length));
    expect(response.status).toBe(200);
  });

  it("should be able to list the first 5 items of User", async () => {
    const user = await createUser();
    const user2 = await createUser();

    const itemsOfUser = [
      await createItem(user),
      await createItem(user),
      await createItem(user),
      await createItem(user),
      await createItem(user),
      await createItem(user),
    ];

    const itemsofUser2 = [await createItem(user2)];

    const items = [...itemsOfUser, ...itemsofUser2];

    let response = await request(app)
      .get("/items?page=1")
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.header).toHaveProperty("x-total-count");
    expect(response.header["x-total-count"]).toBe(String(itemsOfUser.length));
    expect(response.body.length).toBe(5);
    expect(response.status).toBe(200);
  });

  it("should be able to list all items, maximum 5 per page", async () => {
    const user = await createUser();

    const ITEMS_QUANTITY = 12;
    let items = Array();

    for (i = 0; i < ITEMS_QUANTITY; i++) {
      items.push(await createItem(user));
    }

    let totalReceived = 0;
    let page = 1;

    while (totalReceived < ITEMS_QUANTITY) {
      const totalToReceive = ITEMS_QUANTITY - totalReceived;

      if (totalToReceive > 5) {
        const response = await request(app)
          .get(`/items?page=${page}`)
          .set("authorization", `Bearer ${user.generateToken()}`);

        expect(response.body.length).toBe(5);
        expect(response.status).toBe(200);

        totalReceived += 5;
        page++;
      } else {
        const response = await request(app)
          .get(`/items?page=${page}`)
          .set("authorization", `Bearer ${user.generateToken()}`);

        expect(response.body.length).toBe(totalToReceive);
        expect(response.status).toBe(200);

        totalReceived += totalToReceive;
      }
    }
  });
});
