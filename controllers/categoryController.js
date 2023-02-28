const Category = require("../models/Category");

const addCategory = async (req, res, next) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(200).json({
      message: "Category added successful!",
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
    res.status(500).json({
      errors: {
        common: {
          msg: error.message,
        },
      },
    });
  }
};

const deleteCategoryById = async (req, res, next) => {
  try {
    await Category.deleteOne({ _id: req.params.id });
    res.status(200).json({
      message: "Category deleted successful!",
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
  addCategory,
  updateCategoryById,
  deleteCategoryById,
};
