const Article = require("../models/Article");
const { setCommonError } = require("../utilities/commonErrors");
const {
  removeUploadedFile,
} = require("../utilities/removeUploadedFileOrFolder");

const addArticle = async (req, res, next) => {
  try {
    let thumbnailUrl = null;
    if (req.files[0]?.filename) {
      thumbnailUrl =
        process.env.APP_URL +
        "uploads/article/thumbnails/" +
        req.files[0].filename;
    }
    const newArticle = new Article({
      ...req.body,
      category: req.body.categoryId,
      thumbnail: thumbnailUrl,
      user: req.loggedInUser.id,
    });
    await newArticle.save();
    res.status(200).json({
      message: "Article was saved successful!",
    });
  } catch (error) {
    setCommonError(res, error.message, 500);
  }
};

const generateArticleOptionalModelChain = (req, res, next) => {
  req.chainMethods = [
    {
      methodName: "populate",
      path: "category",
      value: "name",
    },
    {
      methodName: "populate",
      path: "user",
      value: "email firstName lastName",
    },
  ];
  next();
};

const generateArticleFilters = (req, res, next) => {
  const { search } = req.query;
  if (search) {
    req.filterQuery = {
      title: { $regex: search, $options: "i" },
    };
  }
  next();
};

const findAllArticles = async (req, res, next) => {
  try {
    res.status(200).json(res.data);
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
      postData.thumbnail =
        process.env.APP_URL +
        "uploads/article/thumbnails/" +
        req.files[0].filename;
    }
    const article = await Article.findOneAndUpdate(
      { _id: req.params.id },
      { $set: postData }
    )
      .populate("category", "name")
      .populate("user", "email firstName lastName");

    if (req.files[0]?.filename && article.thumbnail) {
      let oldFileName = article.thumbnail.split("/article/thumbnails/")[1];
      removeUploadedFile(oldFileName, "article/thumbnails");
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
  generateArticleOptionalModelChain,
  generateArticleFilters,
};
