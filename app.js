const express = require("express");
const app = express();
const db = require("./db/connection");
const endpointsJson = require("./endpoints.json");
const cors = require("cors");

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
  patchCommentByCommentId,
} = require("./app/controllers/controller");

const {
  handle404Errors,
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors");

app.use(cors());

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

commentsRouter
  .route("/:comment_id")
  .delete(deleteCommentById)
  .patch(patchCommentByCommentId);

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
