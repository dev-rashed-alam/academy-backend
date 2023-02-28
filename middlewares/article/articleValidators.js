const { check } = require("express-validator");

const addArticleValidators = [
  check("title").notEmpty().withMessage("Title is required"),
  check("categoryId").notEmpty().withMessage("Category id is required"),
  check("description").notEmpty().withMessage("Description is required"),
];

module.exports = {
  addArticleValidators,
};
