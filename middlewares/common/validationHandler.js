const { validationResult } = require("express-validator");

const validationHandler = (req, res, next) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();

  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    res.status(403).json({
      errors: mappedErrors,
    });
  }
};

module.exports = validationHandler;
