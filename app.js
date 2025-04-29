const endpointsJson = require("./endpoints.json");
const express = require("express");
const app = express();
const db = require("./db/connection");
app.use(express.json());
const {
  getApi,
  getTopics,
  getArticleById,
  getAllArticlesDesc,
  getCommentsByArticleId,
  postComment,
  patchArticleById,
  deleteCommentById,
  getUsers,
} = require("./app/controllers/controller");

const {
  handle404Errors,
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors");

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticlesDesc);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);
app.patch("/api/articles/:article_id", patchArticleById);
app.delete("/api/comments/:comment_id", deleteCommentById);
app.get("/api/users", getUsers);
app.all("/*splat", handle404Errors);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);
module.exports = app;
