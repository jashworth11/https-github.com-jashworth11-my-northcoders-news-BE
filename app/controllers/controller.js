const endpointsJson = require("../../endpoints.json");

const {
  getTopics,
  selectArticleById,
  selectArticlesDesc,
  insertComment,
  selectCommentsByArticleId,
  checkArticleExists,
  updateArticleVotes,
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

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  checkArticleExists(article_id)
    .then(() => {
      return selectCommentsByArticleId(article_id);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  console.log("body", body);
  console.log("username", username);
  console.log("article_id", article_id);
  checkArticleExists(article_id)
    .then(() => {
      return insertComment(article_id, username, body);
    })
    .then((comment) => {
      console.log("comment", comment);

      res.status(201).send({ comment });
    })
    .catch(next);
};
exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  checkArticleExists(article_id)
    .then(() => updateArticleVotes(article_id, inc_votes))
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
