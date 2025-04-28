const db = require("../../db/connection");

exports.getTopics = () => {
  return db
    .query("SELECT * FROM topics")
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err);
    });
};


exports.selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err);
    });
};

