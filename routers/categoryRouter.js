const express = require("express");
const {
  addCategory,
  updateCategoryById,
  deleteCategoryById,
} = require("../controllers/categoryController");
const authMiddleware = require("../middlewares/common/authMiddleware");
const {
  addCategoryValidators,
  addCategoryValidationHandler,
} = require("../middlewares/category/categoryValidators");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  addCategoryValidators,
  addCategoryValidationHandler,
  addCategory
);

router.put(
  "/:id",
  authMiddleware,
  addCategoryValidators,
  addCategoryValidationHandler,
  updateCategoryById
);

router.delete("/:id", deleteCategoryById);

module.exports = router;
