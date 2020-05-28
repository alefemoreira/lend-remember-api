const faker = require("faker");
const truncate = require("../utils/truncate");
const app = require("../../src/app");
const request = require("supertest");
const { Lending, Friend, Item } = require("../../src/app/models");
const {
  createUser,
  createFriend,
  createItem,
  createLending,
} = require("../utils/factories");

describe("Create Lending", () => {
  beforeEach(async () => {
    await Lending.destroy({ truncate: true, force: true });
    await truncate();
  });

  afterEach(async () => {
    await Lending.destroy({ truncate: true, force: true });
    await Friend.destroy({ truncate: true, force: true });
    await Item.destroy({ truncate: true, force: true });
  });

  it("should be able to create a Lending with all information", async () => {
    const user = await createUser();
    const friend = await createFriend(user);
    const item = await createItem(user);

    const body = {
      friend_id: friend.id,
      item_id: item.id,
      lending_date: "2020-04-18",
      receive_date: "2020-05-18",
      received: false,
    };

    const response = await request(app)
      .post("/lendings")
      .set("Authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.body).toHaveProperty("id");
    expect(response.status).toBe(200);
  });

  it("should be able to create a Lending without receive_date and received", async () => {
    const user = await createUser();
    const friend = await createFriend(user);
    const item = await createItem(user);

    const body = {
      friend_id: friend.id,
      item_id: item.id,
      lending_date: "2020-04-18",
    };

    const response = await request(app)
      .post("/lendings")
      .set("Authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.body).toHaveProperty("id");
    expect(response.status).toBe(200);
  });

  it("should be able to create a Lending without receive_date", async () => {
    const user = await createUser();
    const friend = await createFriend(user);
    const item = await createItem(user);

    const body = {
      friend_id: friend.id,
      item_id: item.id,
      lending_date: "2020-04-18",
      received: false,
    };

    const response = await request(app)
      .post("/lendings")
      .set("Authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.body).toHaveProperty("id");
    expect(response.status).toBe(200);
  });

  it("should be able to create a Lending without received", async () => {
    const user = await createUser();
    const friend = await createFriend(user);
    const item = await createItem(user);

    const body = {
      friend_id: friend.id,
      item_id: item.id,
      lending_date: "2020-04-18",
      receive_date: "2020-05-18",
    };

    const response = await request(app)
      .post("/lendings")
      .set("Authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.body).toHaveProperty("id");
    expect(response.status).toBe(200);
  });

  it("should not be able to create a Lending without friend", async () => {
    const user = await createUser();
    const friend = await createFriend(user);
    const item = await createItem(user);

    const body = {
      item_id: item.id,
      lending_date: "2020-04-18",
      receive_date: "2020-05-18",
      received: false,
    };

    const response = await request(app)
      .post("/lendings")
      .set("Authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.status).toBe(500);
  });

  it("should not be able to create a Lending without item", async () => {
    const user = await createUser();
    const friend = await createFriend(user);
    const item = await createItem(user);

    const body = {
      friend_id: friend.id,
      lending_date: "2020-04-18",
      receive_date: "2020-05-18",
      received: false,
    };

    const response = await request(app)
      .post("/lendings")
      .set("Authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.status).toBe(500);
  });

  it("should not be able to create a Lending without friend and item", async () => {
    const user = await createUser();
    const friend = await createFriend(user);
    const item = await createItem(user);

    const body = {
      lending_date: "2020-04-18",
      receive_date: "2020-05-18",
      received: false,
    };

    const response = await request(app)
      .post("/lendings")
      .set("Authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.status).toBe(500);
  });

  it("should not be able to create a Lending without lending_date", async () => {
    const user = await createUser();
    const friend = await createFriend(user);
    const item = await createItem(user);

    const body = {
      friend_id: friend.id,
      item_id: item.id,
      receive_date: "2020-05-18",
      received: false,
    };

    const response = await request(app)
      .post("/lendings")
      .set("Authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.status).toBe(500);
  });

  it("should not be able to create a Lending without all informations", async () => {
    const user = await createUser();
    const friend = await createFriend(user);
    const item = await createItem(user);

    const body = {};

    const response = await request(app)
      .post("/lendings")
      .set("Authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.status).toBe(500);
  });

  it("should not be able to create a Lending with friend and item nonexistent", async () => {
    const user = await createUser();
    const friend = await createFriend(user);
    const item = await createItem(user);

    await friend.destroy();
    await item.destroy();

    const body = {
      friend_id: friend.id,
      item_id: item.id,
      lending_date: "2020-04-18",
      receive_date: "2020-05-18",
      received: false,
    };

    const response = await request(app)
      .post("/lendings")
      .set("authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.status).toBe(400);
  });

  it("should not be able to create a Lending with friend nonexistent", async () => {
    const user = await createUser();
    const friend = await createFriend(user);
    const item = await createItem(user);

    await friend.destroy();

    const body = {
      friend_id: friend.id,
      item_id: item.id,
      lending_date: "2020-04-18",
      receive_date: "2020-05-18",
      received: false,
    };

    const response = await request(app)
      .post("/lendings")
      .set("authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.status).toBe(400);
  });

  it("should not be able to create a Lending with item nonexistent", async () => {
    const user = await createUser();
    const friend = await createFriend(user);
    const item = await createItem(user);

    await item.destroy();

    const body = {
      friend_id: friend.id,
      item_id: item.id,
      lending_date: "2020-04-18",
      receive_date: "2020-05-18",
      received: false,
    };

    const response = await request(app)
      .post("/lendings")
      .set("authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.status).toBe(400);
  });
});

describe("List Lending", () => {
  beforeEach(async () => {
    await truncate();
  });

  afterEach(async () => {
    await Lending.destroy({ truncate: true, force: true });
    await Friend.destroy({ truncate: true, force: true });
    await Item.destroy({ truncate: true, force: true });
  });

  it("should be able to lists 5 lendings of a user with your item and friend", async () => {
    const user = await createUser();
    const friend = await createFriend(user);
    const item = await createItem(user);
    const lendings = Array();
    const LENGTH_LENDINGS_USER = 6;
    const QUANTITY_LENDING_EXPECT = 5;

    for (i = 0; i < LENGTH_LENDINGS_USER; i++) {
      lendings.push(await createLending(user, friend, item));
    }

    const response = await request(app)
      .get("/lendings?page=1")
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.body.length).toBe(QUANTITY_LENDING_EXPECT);
    expect(response.status).toBe(200);
  });

  it("should be able to return total of lendings", async () => {
    const user = await createUser();
    const friend = await createFriend(user);
    const item = await createItem(user);
    const lendings = Array();
    const LENGTH_LENDINGS_USER = 6;

    for (i = 0; i < LENGTH_LENDINGS_USER; i++) {
      lendings.push(await createLending(user, friend, item));
    }

    const response = await request(app)
      .get("/lendings?page=1")
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.header["x-total-count"]).toBe(String(LENGTH_LENDINGS_USER));
    expect(response.status).toBe(200);
  });

  it("should be able to return all of lendings of a user", async () => {
    const user = await createUser();
    const friend = await createFriend(user);
    const item = await createItem(user);
    const lendings = Array();
    const LENDINGS_QUANTITY = 13;
    const MAX_LENDING_PER_PAGE = 5;

    let page = 0;
    let totalReceived = 0;

    for (i = 0; i < LENDINGS_QUANTITY; i++) {
      lendings.push(await createLending(user, friend, item));
    }

    while (totalReceived < LENDINGS_QUANTITY) {
      const TOTAL_TO_RECEIVE = LENDINGS_QUANTITY - totalReceived;
      let expect_quantity = MAX_LENDING_PER_PAGE;
      page++;

      if (TOTAL_TO_RECEIVE < MAX_LENDING_PER_PAGE) {
        expect_quantity = TOTAL_TO_RECEIVE;
      }

      const response = await request(app)
        .get(`/lendings?page=${page}`)
        .set("authorization", `Bearer ${user.generateToken()}`);

      expect(response.body.length).toBe(expect_quantity);
      expect(response.status).toBe(200);

      totalReceived += expect_quantity;
    }
  });

  it("should be able to show only one lending", async () => {
    const user = await createUser();
    const friend = await createFriend(user);
    const item = await createItem(user);
    const lending = await createLending(user, friend, item);

    const response = await request(app)
      .get(`/lendings/${lending.id}`)
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.body.id).toBe(lending.id);
    expect(response.status).toBe(200);
  });

  it("should not be able to show a nonexistent lending", async () => {
    const user = await createUser();
    const friend = await createFriend(user);
    const item = await createItem(user);
    const lending = await createLending(user, friend, item);

    await lending.destroy();

    const response = await request(app)
      .get(`/lendings/${lending.id}`)
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(400);
  });

  it("should not be able to show a lending of other user", async () => {
    const user = await createUser();
    const friend = await createFriend(user);
    const item = await createItem(user);
    const lending = await createLending(user, friend, item);

    const anotherUser = await createUser();

    const response = await request(app)
      .get(`/lendings/${lending.id}`)
      .set("authorization", `Bearer ${anotherUser.generateToken()}`);

    expect(response.status).toBe(400);
  });
});

describe("Update Lending", () => {
  beforeEach(async () => {
    await truncate();
  });

  afterEach(async () => {
    await Lending.destroy({ truncate: true, force: true });
    await Friend.destroy({ truncate: true, force: true });
    await Item.destroy({ truncate: true, force: true });
  });

  it("should be able to update all informations of a Lending", async () => {
    const user = await createUser();
    const friend = await createFriend(user);
    const item = await createItem(user);
    const lending = await createLending(user, friend, item);

    const friend2 = await createFriend(user);
    const item2 = await createItem(user);

    const body = {
      friend_id: friend2.id,
      item_id: item2.id,
      lending_date: "2020-05-08",
      receive_date: "2020-05-09",
      received: true,
    };

    const response = await request(app)
      .put(`/lendings/${lending.id}`)
      .set("authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.body.friend_id).toBe(body.friend_id);
    expect(response.body.item_id).toBe(body.item_id);
    expect(response.body.lending_date).toContain(body.lending_date);
    expect(response.body.receive_date).toContain(body.receive_date);
    expect(response.body.received).toBe(body.received);
    expect(response.status).toBe(200);
  });

  it("should be able to update only one information of a Lending", async () => {
    const user = await createUser();
    const friend = await createFriend(user);
    const item = await createItem(user);
    const lending = await createLending(user, friend, item);

    const friend2 = await createFriend(user);

    const body = {
      friend_id: friend2.id,
    };

    const response = await request(app)
      .put(`/lendings/${lending.id}`)
      .set("authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.body.friend_id).toBe(body.friend_id);
    expect(response.status).toBe(200);
  });
});

describe("Delete Lending", () => {
  beforeEach(async () => {
    await truncate();
  });

  afterEach(async () => {
    await Lending.destroy({ truncate: true, force: true });
    await Friend.destroy({ truncate: true, force: true });
    await Item.destroy({ truncate: true, force: true });
  });

  it("should be able to delete a lending", async () => {
    const user = await createUser();
    const friend = await createFriend(user);
    const item = await createItem(user);
    const lending = await createLending(user, friend, item);

    const response = await request(app)
      .delete(`/lendings/${lending.id}`)
      .set("authorization", `Bearer ${user.generateToken()}`);

    const { count } = await Lending.findAndCountAll({
      where: { id: lending.id, user_id: user.id },
    });

    expect(count).toBe(0);
    expect(response.status).toBe(200);
  });

  it("should not be able to delete a nonexistent lending", async () => {
    const user = await createUser();
    const friend = await createFriend(user);
    const item = await createItem(user);
    const lending = await createLending(user, friend, item);

    await Lending.destroy({ where: { id: lending.id } });

    const response = await request(app)
      .delete(`/lendings/${lending.id}`)
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(400);
  });

  it("should not be able to delete a lending of other user", async () => {
    const user = await createUser();
    const user2 = await createUser();
    const friend = await createFriend(user2);
    const item = await createItem(user2);
    const lending = await createLending(user2, friend, item);

    const response = await request(app)
      .delete(`/lendings/${lending.id}`)
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(401);
  });
});
