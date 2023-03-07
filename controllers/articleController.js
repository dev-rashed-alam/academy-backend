const Article = require("../models/Article");

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
    res.status(500).json({
      errors: {
        common: {
          msg: error.message,
        },
      },
    });
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
    res.status(500).json({
      errors: {
        common: {
          msg: error.message,
        },
      },
    });
  }
};

const deleteArticleById = async (req, res, next) => {
  try {
    await Article.deleteOne({ _id: req.params.id });
    res.status(200).json({
      message: "Article deleted successful!",
    });
  } catch (error) {
    res.status(500).json({
      errors: {
        common: {
          msg: error.message,
        },
      },
    });
  }
};

const findArticleById = async (req, res, next) => {
  try {
    const article = await Article.findOne({ _id: req.params.id }, { __v: 0 })
      .populate("category", "name")
      .populate("user", "email firstName lastName");
    res.status(500).json({
      data: article,
      message: "Successful!",
    });
  } catch (error) {
    res.status(500).json({
      errors: {
        common: {
          msg: error.message,
        },
      },
    });
  }
};

module.exports = {
  addArticle,
  findAllArticles,
  deleteArticleById,
  findArticleById,
};
