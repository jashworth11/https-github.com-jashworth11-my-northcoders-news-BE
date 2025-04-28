const endpointsJson = require("../../endpoints.json");
const { getTopics } = require("../models/model");
exports.getApi = (req, res, next) => {
  res
    .status(200)
    .send(endpointsJson)
    .catch((err) => {
      next(err);
    });
};
exports.getTopics = (req, res, next) => {
  getTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};
