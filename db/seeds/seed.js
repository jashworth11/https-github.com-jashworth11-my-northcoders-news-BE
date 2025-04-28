const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate, createRef } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => db.query(`DROP TABLE IF EXISTS articles;`))
    .then(() => db.query(`DROP TABLE IF EXISTS users;`))
    .then(() => db.query(`DROP TABLE IF EXISTS topics;`))
    .then(() => {
      return db.query(`
    CREATE TABLE topics (
      slug VARCHAR(255) PRIMARY KEY,
      description VARCHAR(1000) NULL,
      img_url VARCHAR(1000)
    );
  `);
    })
    .then(() => {
      return db.query(`
    CREATE TABLE users (
      username VARCHAR(100) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      avatar_url VARCHAR(1000)
    );
  `);
    })
    .then(() => {
      return db.query(`
    CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      topic VARCHAR(100) REFERENCES topics(slug) NOT NULL,
      author VARCHAR(20) REFERENCES users(username) NOT NULL,
      body TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000)
    );
  `);
    })
    .then(() => {
      return db.query(`
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
      body TEXT NOT NULL,
      votes INT DEFAULT 0,
      author VARCHAR(255) REFERENCES users(username) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
    })
    .then(() => {
      const topicsQuery = format(
        `INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING *;`,
        topicData.map((topic) => [topic.slug, topic.description, topic.img_url])
      );
      return db.query(topicsQuery);
    })
    .then(() => {
      const usersQuery = format(
        `INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *;`,
        userData.map((user) => [user.username, user.name, user.avatar_url])
      );
      return db.query(usersQuery);
    })
    .then(() => {
      const formattedArticleData = articleData.map((article) => {
        const legitArticle = convertTimestampToDate(article);
        return [
          legitArticle.title,
          legitArticle.topic,
          legitArticle.author,
          legitArticle.body,
          legitArticle.created_at,
          legitArticle.votes,
          legitArticle.article_img_url,
        ];
      });
      const articlesQuery = format(
        `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;`,
        formattedArticleData
      );
      return db.query(articlesQuery);
    })
    .then((result) => {
      const articleRefObject = createRef(result.rows);

      const formattedCommentData = commentData.map((comment) => {
        const legitComment = convertTimestampToDate(comment);
        return [
          articleRefObject[comment.article_title],
          legitComment.body,
          legitComment.votes,
          legitComment.author,
          legitComment.created_at,
        ];
      });

      const commentsQuery = format(
        `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L RETURNING *;`,
        formattedCommentData
      );
      return db.query(commentsQuery);
    })
    .then((result) => {
      console.log("Seeding completed successfully!");
    })
    .catch((err) => {
      console.error("Error seeding database:", err);
    });
};
module.exports = seed;
