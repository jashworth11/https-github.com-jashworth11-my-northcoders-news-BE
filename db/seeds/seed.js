const db = require("../connection");
const format = require("pg-format");
const convertTimestampToDate = (timestamp) => {
  if (!timestamp) return null;
  return new Date(timestamp).toISOString();
};

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
      const articlesQuery = format(
        `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;`,
        articleData.map((article) => [
          article.title,
          article.topic,
          article.author,
          article.body,
          convertTimestampToDate(article.created_at),
          article.votes,
          article.article_img_url,
        ])
      );
      return db.query(articlesQuery);
    })
    .then(() => {
      const commentsQuery = format(
        `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L RETURNING *;`,
        commentData.map((comment) => [
          comment.article_id,
          comment.body,
          comment.votes,
          comment.author,
          convertTimestampToDate(comment.created_at),
        ])
      );
      return db.query(commentsQuery);
    })
    .then(() => {
      console.log("Seeding completed successfully!");
    })
    .catch((err) => {
      console.error("Error seeding database:", err);
    });
};
module.exports = seed;
