const lendingStatus = require("../utils/lendingStatus");

module.exports = {
  async index(req, res) {
    const user_id = req.userId;
    const { option } = req.params;

    const getStatus = lendingStatus[option];
    const lendings = await getStatus(user_id);

    return res.json(lendings);
  },
};
