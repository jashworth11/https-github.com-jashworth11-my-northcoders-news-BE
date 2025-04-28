const { getApi, getTopics } = require("./app/controllers/controller");
const endpointsJson = require("./endpoints.json");
const express = require("express");
const app = express();
const db = require("./db/connection");
const {
  handle404Errors,
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors");

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.all("/*splat", handle404Errors);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);
module.exports = app;
