const Category = require("../models/Category");
const { setCommonError } = require("../utilities/commonErrors");

const addCategory = async (req, res, next) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(200).json({
      message: "Category added successful!",
    });
  } catch (error) {
    setCommonError(res, error.message, 500);
  }
};

const updateCategoryById = async (req, res, next) => {
  try {
    await Category.updateOne(
      { _id: req.params.id },
      {
        $set: req.body,
      }
    );
    res.status(200).json({
      message: "Category updated successful!",
    });
  } catch (error) {
    setCommonError(res, error.message, 500);
  }
};

const deleteCategoryById = async (req, res, next) => {
  try {
    await Category.deleteOne({ _id: req.params.id });
    res.status(200).json({
      message: "Category deleted successful!",
    });
  } catch (error) {
    setCommonError(res, error.message, 500);
  }
};

const generateCategoryFilters = (req, res, next) => {
  const { search } = req.query;
  if (search) {
    req.filterQuery = {
      name: { $regex: search, $options: "i" },
    };
  }
  next();
};

const findAllCategories = async (req, res, next) => {
  try {
    res.status(200).json(res.data);
  } catch (error) {
    setCommonError(res, error.message, 500);
  }
};

const findCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findOne({ _id: req.params.id }, { __v: 0 });
    res.status(200).json({
      data: category,
      message: "successful!",
    });
  } catch (error) {
    setCommonError(res, error.message, 500);
  }
};

module.exports = {
  addCategory,
  updateCategoryById,
  deleteCategoryById,
  findAllCategories,
  findCategoryById,
  generateCategoryFilters,
};
