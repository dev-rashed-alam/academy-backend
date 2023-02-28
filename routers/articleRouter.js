const express = require("express");
const {
  addArticle,
  findAllArticles,
} = require("../controllers/articleController");
const {
  addArticleValidators,
} = require("../middlewares/article/articleValidators");
const authMiddleware = require("../middlewares/common/authMiddleware");
const validationHandler = require("../middlewares/common/validationHandler");

const router = express.Router();

router.get("/all", authMiddleware, findAllArticles);

router.post(
  "/",
  authMiddleware,
  addArticleValidators,
  validationHandler,
  addArticle
);

module.exports = router;
