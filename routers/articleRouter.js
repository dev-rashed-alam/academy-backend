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

const router = express.Router();

router.get("/all", authMiddleware, findAllArticles);
router.get("/:id", authMiddleware, findArticleById);
router.delete("/:id", authMiddleware, deleteArticleById);

router.post(
  "/",
  thumbnailUpload,
  authMiddleware,
  addArticleValidators,
  articleValidationHandler,
  addArticle
);

router.put("/:id", authMiddleware, thumbnailUpload, updateArticleById);

module.exports = router;
