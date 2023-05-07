const express = require("express");
const Article = require("../models/Article");
const {
  addArticle,
  findAllArticles,
  deleteArticleById,
  findArticleById,
  updateArticleById,
  generateArticleOptionalModelChain,
} = require("../controllers/articleController");
const {
  addArticleValidators,
  articleValidationHandler,
} = require("../middlewares/article/articleValidators");
const thumbnailUpload = require("../middlewares/article/thumbnailUpload");
const authMiddleware = require("../middlewares/common/authMiddleware");
const checkIsValidObjectId = require("../middlewares/common/checkIsValidObjectId");
const { doPagination } = require("../middlewares/common/paginationMiddleware");

const router = express.Router();

router.get(
  "/all",
  authMiddleware,
  generateArticleOptionalModelChain,
  doPagination(Article),
  findAllArticles
);
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
