const endpointsJson = require("./endpoints.json");
const express = require("express");
const app = express();
const db = require("./db/connection");

const {
  getApi,
  getTopics,
  getArticleById,
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
app.all("/*splat", handle404Errors);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);
module.exports = app;
