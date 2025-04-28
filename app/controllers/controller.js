const endpointsJson = require("../../endpoints.json");
const { getTopics, selectArticleById } = require("../models/model");

exports.getApi = (req, res, next) => {
  res.status(200).send(endpointsJson).catch(next);
};
exports.getTopics = (req, res, next) => {
  getTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  if (isNaN(Number(article_id))) {
    return next({ status: 400, msg: "bad request!" });
  }
  selectArticleById(article_id)
    .then((article) => {
      if (!article) {
        return next({ status: 404, msg: "not found!" });
      }
      res.status(200).send({ article });
    })
    .catch(next);
};
