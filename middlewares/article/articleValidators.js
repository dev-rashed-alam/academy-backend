const { check, validationResult } = require("express-validator");
const {
  removeUploadedFile,
} = require("../../utilities/removeUploadedFileOrFolder");

const addArticleValidators = [
  check("title").notEmpty().withMessage("Title is required"),
  check("categoryId").notEmpty().withMessage("Category id is required"),
  check("description").notEmpty().withMessage("Description is required"),
];

const articleValidationHandler = (req, res, next) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();

  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    if (req.files?.length > 0) {
      const { filename } = req.files[0];
      removeUploadedFile(filename, "article/thumbnails");
    }

    res.status(403).json({
      errors: mappedErrors,
    });
  }
};

module.exports = {
  addArticleValidators,
  articleValidationHandler,
};
