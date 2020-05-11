const faker = require("faker");
const { User, Friend, Item, Lending } = require("../../src/app/models");

module.exports = {
  async createUser(properties = {}) {
    const body = {
      name: properties.name || faker.name.findName(),
      email: properties.email || faker.internet.email(),
      password: properties.password || faker.internet.password(),
    };

    const user = await User.create(body);
    // console.log(body);

    return user;
  },

  async createFriend(user, properties = {}) {
    const body = {
      user_id: user.id,
      name: properties.name || faker.name.findName(),
      email: properties.email || faker.internet.email(),
      whatsapp: properties.whatsapp || faker.phone.phoneNumber(),
    };

    const friend = await Friend.create(body);
    // console.log(body);

    return friend;
  },

  async createItem(user, properties = {}) {
    const body = {
      user_id: user.id,
      title: properties.title || faker.commerce.productName(),
      description: properties.description || faker.lorem.sentence(),
    };

    const item = await Item.create(body);
    // console.log(body);

    return item;
  },

  async createLending(user, friend, item, properties = {}) {
    const body = {
      user_id: user.id,
      friend_id: friend.id,
      item_id: item.id,
      lending_date: properties.lending_date || faker.date.recent(1),
      receive_date: properties.lending_date || faker.date.future(),
      received: properties.received || false,
    };

    const lending = await Lending.create(body);
    // console.log(body);

    return lending;
  },
};
