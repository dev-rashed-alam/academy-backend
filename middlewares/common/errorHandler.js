const createError = require("http-errors");

const notFoundHandler = (req, res, next) => {
  next(createError(404, "Your requested content was not found!"));
};

//default error handler
const errorHandler = (err, req, res, next) => {
  const errors =
    process.env.NODE_ENV === "development" ? err : { message: err.message };
  res.status(err.status || 500);
  res.json(errors);
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
