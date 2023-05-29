const express = require("express");
const {
  addCategory,
  updateCategoryById,
  deleteCategoryById,
  findAllCategories,
  findCategoryById,
  generateCategoryFilters,
} = require("../controllers/categoryController");
const authMiddleware = require("../middlewares/common/authMiddleware");
const {
  addCategoryValidators,
} = require("../middlewares/category/categoryValidators");
const validationHandler = require("../middlewares/common/validationHandler");
const checkIsValidObjectId = require("../middlewares/common/checkIsValidObjectId");
const { doPagination } = require("../middlewares/common/paginationMiddleware");
const Category = require("../models/Category");

const router = express.Router();

router.get(
  "/all",
  authMiddleware,
  generateCategoryFilters,
  doPagination(Category),
  findAllCategories
);
router.get("/:id", authMiddleware, checkIsValidObjectId, findCategoryById);

router.post(
  "/",
  authMiddleware,
  addCategoryValidators,
  validationHandler,
  addCategory
);

router.put(
  "/:id",
  authMiddleware,
  checkIsValidObjectId,
  addCategoryValidators,
  validationHandler,
  updateCategoryById
);

router.delete("/:id", deleteCategoryById);

module.exports = router;
