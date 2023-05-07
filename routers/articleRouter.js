const express = require("express");
const {
  addArticle,
  findAllArticles,
  deleteArticleById,
  findArticleById,
  updateArticleById,
} = require("../controllers/articleController");
const {
  addArticleValidators,
  articleValidationHandler,
} = require("../middlewares/article/articleValidators");
const thumbnailUpload = require("../middlewares/article/thumbnailUpload");
const authMiddleware = require("../middlewares/common/authMiddleware");
const checkIsValidObjectId = require("../middlewares/common/checkIsValidObjectId");

const router = express.Router();

router.get("/all", authMiddleware, findAllArticles);
router.get("/:id", authMiddleware, checkIsValidObjectId, findArticleById);
router.delete("/:id", authMiddleware, checkIsValidObjectId, deleteArticleById);

router.post(
  "/",
  authMiddleware,
  thumbnailUpload,
  addArticleValidators,
  articleValidationHandler,
  addArticle
);

router.put("/:id", authMiddleware, thumbnailUpload, updateArticleById);

module.exports = router;
