exports.handle404Errors =
  ("/api/*",
  (req, res) => {
    res.status(404).send({ msg: "not found!" });
  });
exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};
exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23503" || err.code === "23502") {
    res.status(400).send({ msg: "bad request!" });
  } else {
    next(err);
  }
};
exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "internal server error!" });
};
