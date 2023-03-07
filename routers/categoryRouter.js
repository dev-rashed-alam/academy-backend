const express = require("express");
const {
  addCategory,
  updateCategoryById,
  deleteCategoryById,
  findAllCategoris,
  findCategoryById,
} = require("../controllers/categoryController");
const authMiddleware = require("../middlewares/common/authMiddleware");
const {
  addCategoryValidators,
} = require("../middlewares/category/categoryValidators");
const validationHandler = require("../middlewares/common/validationHandler");

const router = express.Router();

router.get("/all", authMiddleware, findAllCategoris);
router.get("/:id", authMiddleware, findCategoryById);

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
  addCategoryValidators,
  validationHandler,
  updateCategoryById
);

router.delete("/:id", deleteCategoryById);

module.exports = router;
