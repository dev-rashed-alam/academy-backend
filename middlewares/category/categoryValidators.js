const { check, validationResult } = require("express-validator");

const addCategoryValidators = [
  check("name").notEmpty().withMessage("Category name is required"),
];

const addCategoryValidationHandler = (req, res, next) => {
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

module.exports = {
  addCategoryValidators,
  addCategoryValidationHandler,
};
