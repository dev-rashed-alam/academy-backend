const Article = require("../models/Article");
const { setCommonError } = require("../utilities/commonErrors");
const removeUploadedFile = require("../utilities/removeUploadedFIle");

const addArticle = async (req, res, next) => {
  try {
    const newArticle = new Article({
      ...req.body,
      category: req.body.categoryId,
      thumbnail: req.files[0].filename,
      user: req.loggedInUser.id,
    });
    await newArticle.save();
    res.status(200).json({
      message: "Article wase saved successful!",
    });
  } catch (error) {
    setCommonError(res, error.message, 500);
  }
};

const findAllArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({}, { __v: 0 })
      .sort({
        createAt: -1,
      })
      .populate("category", "name")
      .populate("user", "email firstName lastName");
    res.status(200).json({
      data: articles,
      message: "successful",
    });
  } catch (error) {
    setCommonError(res, error.message, 500);
  }
};

const deleteArticleById = async (req, res, next) => {
  try {
    await Article.deleteOne({ _id: req.params.id });
    res.status(200).json({
      message: "Article deleted successful!",
    });
  } catch (error) {
    setCommonError(res, error.message, 500);
  }
};

const findArticleById = async (req, res, next) => {
  try {
    const article = await Article.findOne({ _id: req.params.id }, { __v: 0 })
      .populate("category", "name")
      .populate("user", "email firstName lastName");
    res.status(200).json({
      data: article,
      message: "Successful!",
    });
  } catch (error) {
    setCommonError(res, error.message, 500);
  }
};

const updateArticleById = async (req, res, next) => {
  try {
    const postData = { ...req.body };
    if (req.files[0]?.filename) {
      postData.thumbnail = req.files[0].filename;
    }

    const article = await Article.findOneAndUpdate(
      { _id: req.params.id },
      { $set: postData }
    )
      .populate("category", "name")
      .populate("user", "email firstName lastName");

    if (req.files[0]?.filename) {
      removeUploadedFile(article.thumbnail, "article/thumbnails");
    }
    res.status(200).json({
      message: "Successful!",
    });
  } catch (error) {
    setCommonError(res, error.message, 500);
  }
};

module.exports = {
  addArticle,
  findAllArticles,
  deleteArticleById,
  findArticleById,
  updateArticleById,
};
