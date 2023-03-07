const { check, validationResult } = require("express-validator");
const path = require("path");

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
      unlink(
        path.join(
          __dirname,
          `../../public/uploads/article/thumbnails/${filename}`
        ),
        (err) => {
          if (err) console.log(err);
        }
      );
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
