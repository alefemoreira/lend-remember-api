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

describe("Create Friend", () => {
  beforeEach(async () => {
    await truncate();
  });

  afterEach(async () => {
    await Friend.destroy({ truncate: true, force: true });
  });

  it("should be able to create a new friend with all informations", async () => {
    const user = await createUser();

    const body = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      whatsapp: faker.phone.phoneNumber(),
    };

    const response = await request(app)
      .post("/friends")
      .set("authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.status).toBe(200);
  });

  it("should be able to create a new user only with name", async () => {
    const user = await createUser();

    const body = {
      name: faker.name.findName(),
    };

    const response = await request(app)
      .post("/friends")
      .set("authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.status).toBe(200);
  });

  it("should be able to create a new user only with name and email", async () => {
    const user = await createUser();

    const body = {
      name: faker.name.findName(),
      email: faker.internet.email(),
    };

    const response = await request(app)
      .post("/friends")
      .set("authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.status).toBe(200);
  });

  it("should be able to create a new user only with name and whatsapp", async () => {
    const user = await createUser();

    const body = {
      name: faker.name.findName(),
      whatsapp: faker.phone.phoneNumber(),
    };

    const response = await request(app)
      .post("/friends")
      .set("authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.status).toBe(200);
  });
});

describe("List Friend", () => {
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

  it("should be able to list 5 friends of User", async () => {
    const QUANTITY_FRIEND_EXPECT = 5;
    const user = await createUser();

    for (i = 0; i < 6; i++) {
      await createFriend(user);
    }

    await createFriend(await createUser());

    const response = await request(app)
      .get(`/friends?page=1`)
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.body.length).toBe(QUANTITY_FRIEND_EXPECT);
    expect(response.status).toBe(200);
  });

  it("should be able to list all friends, show through pages, maximum 5 per page", async () => {
    const user = await createUser();
    const MAX_FRIEND_PER_PAGE = 5;
    const FRIENDS_QUANTITY = 12;
    const friendsOfUser = Array();
    let page = 0;
    let totalReceived = 0;

    for (i = 0; i < FRIENDS_QUANTITY; i++) {
      friendsOfUser.push(await createFriend(user));
    }

    while (totalReceived < FRIENDS_QUANTITY) {
      let expect_quantity = MAX_FRIEND_PER_PAGE;
      const TOTAL_TO_RECEIVE = FRIENDS_QUANTITY - totalReceived;
      page++;

      if (TOTAL_TO_RECEIVE <= MAX_FRIEND_PER_PAGE) {
        expect_quantity = TOTAL_TO_RECEIVE;
      }

      const response = await request(app)
        .get(`/friends?page=${page}`)
        .set("authorization", `Bearer ${user.generateToken()}`);

      expect(response.body.length).toBe(expect_quantity);
      expect(response.status).toBe(200);

      totalReceived += expect_quantity;
    }
  });

  it("should be able to show only one Friend", async () => {
    const user = await createUser();
    const friend = await createFriend(user);

    const response = await request(app)
      .get(`/friends/${friend.id}`)
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.body.id).toBe(friend.id);
    expect(response.status).toBe(200);
  });

  it("should not be able to show a nonexistent Friend", async () => {
    const user = await createUser();
    const friend = await createFriend(user);

    await friend.destroy();

    const response = await request(app)
      .get(`/friends/${friend.id}`)
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(400);
  });

  it("should not be able to show a Friend of other User", async () => {
    const user = await createUser();
    const otherUser = await createUser();
    const friend = await createFriend(otherUser);

    const response = await request(app)
      .get(`/friends/${friend.id}`)
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(400);
  });
});

describe("Update Friend", () => {
  beforeEach(async () => {
    await truncate();
  });

  afterEach(async () => {
    await Friend.destroy({ truncate: true, force: true });
  });

  it("should be able to update the name of a friend", async () => {
    const user = await createUser();
    const friend = await createFriend(user);

    const body = {
      name: "Àlefe de Lima Moreira",
    };

    const response = await request(app)
      .put(`/friends/${friend.id}`)
      .set("authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.body.name).toBe(body.name);
    expect(response.status).toBe(200);
  });

  it("should be able to update the email of a friend", async () => {
    const user = await createUser();
    const friend = await createFriend(user);

    const body = {
      email: "alefelim@gmail.com",
    };

    const response = await request(app)
      .put(`/friends/${friend.id}`)
      .set("authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.body.email).toBe(body.email);
    expect(response.status).toBe(200);
  });

  it("should be able to update the whatsapp of a friend", async () => {
    const user = await createUser();
    const friend = await createFriend(user);

    const body = {
      whatsapp: "+5583988883333",
    };

    const response = await request(app)
      .put(`/friends/${friend.id}`)
      .set("authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.body.whatsapp).toBe(body.whatsapp);
    expect(response.status).toBe(200);
  });

  it("should be able to update the all informations of a friend", async () => {
    const user = await createUser();
    const friend = await createFriend(user);

    const body = {
      name: "Àlefe de Lima Moreira",
      email: "alefelim@gmail.com",
      whatsapp: "+5583988883333",
    };

    const response = await request(app)
      .put(`/friends/${friend.id}`)
      .set("authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.body.whatsapp).toBe(body.whatsapp);
    expect(response.body.email).toBe(body.email);
    expect(response.body.name).toBe(body.name);
    expect(response.status).toBe(200);
  });

  it("should not be able to update a nonexistent friend", async () => {
    const user = await createUser();
    const friend = await createFriend(user);

    await Friend.destroy({ where: { id: friend.id } });

    const body = {
      name: "Àlefe de Lima Moreira",
      email: "alefelim@gmail.com",
      whatsapp: "+5583988883333",
    };

    const response = await request(app)
      .put(`/friends/${friend.id}`)
      .set("authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.status).toBe(400);
  });

  it("nothing should be happen if not passing body or passing a void body", async () => {
    const user = await createUser();
    const friend = await createFriend(user);

    const body = {};

    const response = await request(app)
      .put(`/friends/${friend.id}`)
      .set("authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.body).not.toHaveProperty("name");
    expect(response.body).not.toHaveProperty("email");
    expect(response.body).not.toHaveProperty("whatsapp");
    expect(response.status).toBe(200);
  });

  it("should not be able to update a friend of other user", async () => {
    const user = await createUser();
    const user2 = await createUser();
    const friend = await createFriend(user2);

    const body = {
      name: "Álefe",
      email: "delimaalefe@gmail.com",
      whatsapp: "+5583988884444",
    };

    const response = await request(app)
      .put(`/friends/${friend.id}`)
      .set("authorization", `Bearer ${user.generateToken()}`)
      .send(body);

    expect(response.status).toBe(401);
  });
});

describe("Delete Friend", () => {
  beforeEach(async () => {
    await truncate();
  });

  afterEach(async () => {
    await Friend.destroy({ truncate: true, force: true });
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

  it("should be able to delete all entities that depends of Friend", async () => {
    let user = await createUser();
    let friend = await createFriend(user);
    let item = await createItem(user);
    let lending = await createLending(user, friend, item);

    const response = await request(app)
      .delete(`/friends/${friend.id}`)
      .set("authorization", `Bearer ${user.generateToken()}`);

    user = await User.findOne({ where: { id: user.id } });
    friend = await Friend.findOne({ where: { id: friend.id } });
    item = await Item.findOne({ where: { id: item.id } });
    lending = await Lending.findOne({ where: { id: lending.id } });

    expect(user).not.toBe(null);
    expect(item).not.toBe(null);
    expect(friend).toBe(null);
    expect(lending).toBe(null);
    expect(response.status).toBe(200);
  });
});
