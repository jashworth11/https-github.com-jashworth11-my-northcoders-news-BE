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
exports.checkArticleExists = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found!" });
      }
    });
};
exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments 
     WHERE article_id = $1
     ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => rows);
};
exports.insertComment = (article_id, username, body) => {
  return db
    .query(
      `INSERT INTO comments (article_id, author, body)
     VALUES ($1, $2, $3)
     RETURNING comment_id, body, article_id, author, votes, created_at`,
      [article_id, username, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
