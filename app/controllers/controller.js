const endpointsJson = require("../../endpoints.json");

const {
  getTopics,
  selectArticleById,
  selectArticlesDesc,
  selectArticleByIdComments,
} = require("../models/model");

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
    return Promise.reject({ status: 400, msg: "bad request!" });
  }
  selectArticleById(article_id)
    .then((article) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: "not found!" });
      }
      res.status(200).send({ article });
    })
    .catch(next);
};
exports.getAllArticlesDesc = (req, res, next) => {
  selectArticlesDesc()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
exports.getArticleByIdComments = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleByIdComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
