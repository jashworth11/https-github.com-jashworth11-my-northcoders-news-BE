const db = require("../../db/connection");

exports.getTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then((result) => {
      return result.rows[0];
    });
};

exports.selectArticlesDesc = () => {
  return db
    .query("SELECT * FROM articles ORDER BY created_at DESC")
    .then((result) => {
      return result.rows;
    });
};
