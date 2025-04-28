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
exports.selectArticleByIdComments = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found!" });
      }
      return db
        .query(
          `SELECT * FROM comments 
       WHERE article_id = $1
       ORDER BY created_at DESC`,
          [article_id]
        )
        .then(({ rows }) => {
          return rows;
        });
    });
};
