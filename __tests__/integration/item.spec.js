const faker = require("faker");
const truncate = require("../utils/truncate");
const app = require("../../src/app");
const request = require("supertest");
const { User, Friend, Item, Lending } = require("../../src/app/models");
const {
  createUser,
  createFriend,
  createItem,
  createLending,
} = require("../utils/factories");

describe("Create Item", () => {
  beforeEach(async () => {
    await truncate();
  });

  afterEach(async () => {
    await Item.destroy({ truncate: true, force: true });
  });

  it("should be able to create a Item with all informations", async () => {
    const user = await createUser();

    const body = {
      title: faker.commerce.productName(),
      description: faker.lorem.sentence(),
    };

    const response = await request(app)
      .post("/items")
      .set("Authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.body).toHaveProperty("id");
    expect(response.status).toBe(200);
  });

  it("should be able to create a Item only with title", async () => {
    const user = await createUser();

    const body = {
      title: faker.commerce.productName(),
    };

    const response = await request(app)
      .post("/items")
      .set("Authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.body).toHaveProperty("id");
    expect(response.status).toBe(200);
  });
});

describe("List Item", () => {
  beforeEach(async () => {
    await truncate();
  });

  afterEach(async () => {
    await Item.destroy({ truncate: true, force: true });
  });

  it("should be able to show the total of items registered of user", async () => {
    const user = await createUser();
    const itemsOfUser = Array();

    for (i = 1; i < 6; i++) {
      itemsOfUser.push(await createItem(user));
    }

    const itemsLength = itemsOfUser.length;

    let response = await request(app)
      .get("/items?page=1")
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.header["x-total-count"]).toBe(String(itemsLength));
    expect(response.status).toBe(200);
  });

  it("should be able to list 5 items of User", async () => {
    const QUANTITY_ITEM_EXPECT = 5;
    const user = await createUser();
    const itemsOfUser = Array();

    for (i = 1; i < 6; i++) {
      itemsOfUser.push(await createItem(user));
    }

    let response = await request(app)
      .get("/items?page=1")
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.body.length).toBe(QUANTITY_ITEM_EXPECT);
    expect(response.status).toBe(200);
  });

  it("should be able to list all items, show through pages, maximum 5 per page", async () => {
    const ITEMS_QUANTITY = 12;
    const MAX_ITEM_PER_PAGE = 5;
    const user = await createUser();
    const items = Array();
    let totalReceived = 0;
    let page = 0;

    for (i = 0; i < ITEMS_QUANTITY; i++) {
      items.push(await createItem(user));
    }

    while (totalReceived < ITEMS_QUANTITY) {
      const TOTAL_TO_RECEIVE = ITEMS_QUANTITY - totalReceived;
      let expect_quantity = MAX_ITEM_PER_PAGE;
      page++;

      if (TOTAL_TO_RECEIVE <= MAX_ITEM_PER_PAGE) {
        expect_quantity = TOTAL_TO_RECEIVE;
      }

      const response = await request(app)
        .get(`/items?page=${page}`)
        .set("authorization", `Bearer ${user.generateToken()}`);

      expect(response.body.length).toBe(expect_quantity);
      expect(response.status).toBe(200);

      totalReceived += expect_quantity;
    }
  });

  it("should be able to show only one Item", async () => {
    let user = await createUser();
    let item = await createItem(user);

    const response = await request(app)
      .get(`/items/${item.id}`)
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.body.id).toBe(item.id);
    expect(response.status).toBe(200);
  });

  it("should not be able to show a nonexistent Item", async () => {
    let user = await createUser();
    let item = await createItem(user);

    await item.destroy();

    const response = await request(app)
      .get(`/items/${item.id}`)
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(400);
  });

  it("should not be able to show a Item of other User", async () => {
    let user = await createUser();
    let otherUser = await createUser();
    let item = await createItem(otherUser);

    const response = await request(app)
      .get(`/items/${item.id}`)
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(400);
  });
});

describe("Update Item", () => {
  beforeEach(async () => {
    await truncate();
  });

  afterEach(async () => {
    await Item.destroy({ truncate: true, force: true });
  });

  it("should be able to update all informations of a item", async () => {
    const user = await createUser();
    const item = await createItem(user);

    const body = {
      title: "Galaxy A30",
      description: "My smartphone",
    };

    const response = await request(app)
      .put(`/items/${item.id}`)
      .set("Authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.body.title).toBe(body.title);
    expect(response.body.description).toBe(body.description);
    expect(response.status).toBe(200);
  });

  it("should be able to update the title of a item", async () => {
    const user = await createUser();
    const item = await createItem(user);

    const body = {
      title: "Galaxy A30",
    };

    const response = await request(app)
      .put(`/items/${item.id}`)
      .set("Authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.body.title).toBe(body.title);
    // expect(response.body).not.toHaveProperty("description");
    expect(response.status).toBe(200);
  });

  it("should be able to update the description of a item", async () => {
    const user = await createUser();
    const item = await createItem(user);

    const body = {
      description: "My smartphone",
    };

    const response = await request(app)
      .put(`/items/${item.id}`)
      .set("Authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.body.description).toBe(body.description);
    // expect(response.body).not.toHaveProperty("title");
    expect(response.status).toBe(200);
  });

  it("should not be able to update any information of a nonexistent item", async () => {
    const user = await createUser();
    const item = await createItem(user);

    await Item.destroy({ where: { id: item.id } });

    const body = {
      description: "My smartphone",
    };

    const response = await request(app)
      .put(`/items/${item.id}`)
      .set("Authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.body).not.toHaveProperty("title");
    expect(response.body).not.toHaveProperty("description");
    expect(response.status).toBe(400);
  });

  it("should not be able to update a item of other user", async () => {
    const user = await createUser();
    const user2 = await createUser();
    const item = await createItem(user2);

    const body = {
      description: "Galaxy A30",
      description: "My smartphone",
    };

    const response = await request(app)
      .put(`/items/${item.id}`)
      .set("Authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.status).toBe(401);
  });
});

describe("Delete Item", () => {
  beforeEach(async () => {
    await truncate();
  });

  afterEach(async () => {
    await Item.destroy({ truncate: true, force: true });
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

  it("should be able to delete all entities that depends of Friend", async () => {
    let user = await createUser();
    let friend = await createFriend(user);
    let item = await createItem(user);
    let lending = await createLending(user, friend, item);

    const response = await request(app)
      .delete(`/items/${item.id}`)
      .set("authorization", `Bearer ${user.generateToken()}`);

    user = await User.findOne({ where: { id: user.id } });
    friend = await Friend.findOne({ where: { id: friend.id } });
    item = await Item.findOne({ where: { id: item.id } });
    lending = await Lending.findOne({ where: { id: lending.id } });

    expect(user).not.toBe(null);
    expect(friend).not.toBe(null);
    expect(item).toBe(null);
    expect(lending).toBe(null);
    expect(response.status).toBe(200);
  });
});
