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
exports.selectArticles = (sort_by = "created_at", order = "DESC", topic) => {
  const allowedInputs = [
    "created_at",
    "title",
    "votes",
    "article_id",
    "comment_count",
  ];
  let queryStr = `
    SELECT 
      articles.*,
      COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
  `;
  if (!allowedInputs.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "bad request!" });
  }
  const queryValues = [];
  if (topic) {
    queryStr += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  }
  queryStr += `
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order}
  `;
  return db.query(queryStr, queryValues).then(({ rows }) => {
    if (topic && rows.length === 0) {
      return db
        .query("SELECT * FROM topics WHERE slug = $1", [topic])
        .then(({ rows: topicRows }) => {
          if (topicRows.length === 0) {
            return Promise.reject({ status: 404, msg: "Topic not found" });
          }
          return [];
        });
    }
    return rows;
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
exports.updateArticleVotes = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles 
     SET votes = votes + $1 
     WHERE article_id = $2 
     RETURNING *`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => rows[0]);
};
exports.removeCommentById = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found!" });
      }
      return rows[0];
    });
};
exports.selectTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};
exports.selectUsers = () => {
  return db.query("SELECT * FROM users").then(({ rows }) => {
    return rows;
  });
};
