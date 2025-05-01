// const endpointsJson = require("./endpoints.json");
// const express = require("express");
// const app = express();
// const db = require("./db/connection");
// app.use(express.json());
// const {
//   getApi,
//   getTopics,
//   getArticleById,
//   getAllArticles,
//   getCommentsByArticleId,
//   postComment,
//   patchArticleById,
//   deleteCommentById,
//   getUsers,
// } = require("./app/controllers/controller");

// const {
//   handle404Errors,
//   handleCustomErrors,
//   handlePsqlErrors,
//   handleServerErrors,
// } = require("./errors");

// app.get("/api", getApi);
// app.get("/api/topics", getTopics);
// app.get("/api/articles/:article_id", getArticleById);
// app.get("/api/articles", getAllArticles);
// app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
// app.post("/api/articles/:article_id/comments", postComment);
// app.patch("/api/articles/:article_id", patchArticleById);
// app.delete("/api/comments/:comment_id", deleteCommentById);
// app.get("/api/users", getUsers);
// app.all("/*splat", handle404Errors);
// app.use(handleCustomErrors);
// app.use(handlePsqlErrors);
// app.use(handleServerErrors);
// module.exports = app;

const express = require("express");
const app = express();
const db = require("./db/connection");
const endpointsJson = require("./endpoints.json");

const {
  getTopics,
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
  postComment,
  patchArticleById,
  deleteCommentById,
  getUsers,
  getUserByUsername,
} = require("./app/controllers/controller");

const {
  handle404Errors,
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors");

const apiRouter = express.Router();
const articlesRouter = express.Router();
const commentsRouter = express.Router();
const topicsRouter = express.Router();
const usersRouter = express.Router();

apiRouter.get("/", (req, res) => res.status(200).send(endpointsJson));

topicsRouter.route("/").get(getTopics);

articlesRouter.route("/").get(getAllArticles);

usersRouter.route("/:username").get(getUserByUsername);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postComment);

commentsRouter.route("/:comment_id").delete(deleteCommentById);
usersRouter.route("/").get(getUsers);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);

app.use(express.json());
app.use("/api", apiRouter);

app.all("/*splat", handle404Errors);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
