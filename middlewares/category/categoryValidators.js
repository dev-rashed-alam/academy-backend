const { check } = require("express-validator");

const addCategoryValidators = [
  check("name").notEmpty().withMessage("Category name is required"),
];

module.exports = {
  addCategoryValidators,
};
