const truncate = require("../utils/truncate");
const app = require("../../src/app");
const request = require("supertest");
const { User } = require("../../src/app/models");
const faker = require("faker");
const { createUser, createFriend, createItem } = require("../utils/factories");

describe("User", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("Should receive the name, email and password for create a new user", async () => {
    const response = await request(app).post("/users").send({
      name: "Álefe Moreira",
      email: faker.internet.email(),
      password: "123456",
    });

    expect(response.body).toHaveProperty("name");
    expect(response.status).toBe(200);
  });

  it("Should storage hash of user password ", async () => {
    const email = faker.internet.email();

    const response = await request(app).post("/users").send({
      name: "Álefe Moreira",
      email,
      password: "123456",
    });

    const user = await User.findOne({
      where: { email },
    });

    const checkPassword = await user.checkPassword("123456");

    expect(checkPassword).toBe(true);
    expect(response.status).toBe(200);
  });
});

describe("Friend", () => {
  beforeEach(async () => {
    await truncate();
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
      .send(body)
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });

  it("should be able to create a new user only with name", async () => {
    const user = await createUser();

    const body = {
      name: faker.name.findName(),
    };

    const response = await request(app)
      .post("/friends")
      .send(body)
      .set("authorization", `Bearer ${user.generateToken()}`);

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
      .send(body)
      .set("authorization", `Bearer ${user.generateToken()}`);

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
      .send(body)
      .set("authorization", `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });
});

describe("Friend", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should be able to create a Item with all informations", async () => {
    const user = await createUser();

    const body = {
      title: faker.commerce.productName(),
      description: faker.lorem.sentence(),
    };

    const response = await request(app)
      .post("/items")
      .send(body)
      .set("Authorization", `Bearer ${user.generateToken()}`);

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
      .send(body)
      .set("Authorization", `Bearer ${user.generateToken()}`);

    expect(response.body).toHaveProperty("id");
    expect(response.status).toBe(200);
  });
});

describe("Lending", () => {
  beforeEach(async () => {
    await truncate();
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
      .send(body)
      .set("Authorization", `Bearer ${user.generateToken()}`);

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
      .send(body)
      .set("Authorization", `Bearer ${user.generateToken()}`);

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
      .send(body)
      .set("Authorization", `Bearer ${user.generateToken()}`);

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
      .send(body)
      .set("Authorization", `Bearer ${user.generateToken()}`);

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
      .send(body)
      .set("Authorization", `Bearer ${user.generateToken()}`);

    expect(response.body).toHaveProperty("id");
    expect(response.status).toBe(400);
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
      .send(body)
      .set("Authorization", `Bearer ${user.generateToken()}`);

    expect(response.body).toHaveProperty("id");
    expect(response.status).toBe(400);
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
      .send(body)
      .set("Authorization", `Bearer ${user.generateToken()}`);

    expect(response.body).toHaveProperty("id");
    expect(response.status).toBe(400);
  });

  it("should not be able to create a Lending without all informations", async () => {
    const user = await createUser();
    const friend = await createFriend(user);
    const item = await createItem(user);

    const body = {};

    const response = await request(app)
      .post("/lendings")
      .send(body)
      .set("Authorization", `Bearer ${user.generateToken()}`);

    expect(response.body).toHaveProperty("id");
    expect(response.status).toBe(400);
  });
});
