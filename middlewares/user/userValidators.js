const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const User = require("../../models/User");
const {
  removeUploadedFile,
} = require("../../utilities/removeUploadedFileOrFolder");

const addUserValidators = [
  check("firstName")
    .isLength({ min: 1 })
    .withMessage("First name is required!")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("First name must not contain anything other than alphabet")
    .trim(),
  check("lastName")
    .isLength({ min: 1 })
    .withMessage("Last name is required!")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Last name must not contain anything other than alphabet")
    .trim(),
  check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .trim()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          throw createError("Email already in use");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check("phoneNumber")
    .isLength({ min: 4 })
    .withMessage("Phone number must be a valid mobile number")
    .trim()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ phoneNumber: value });
        if (user) {
          throw createError("Phone number already is use!");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
  check("password")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol"
    ),
];

const addUserValidationHandler = (req, res, next) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();

  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    // remove uploaded files
    if (req.files?.length > 0) {
      const { filename } = req.files[0];
      removeUploadedFile(filename, "avatars");
    }
    // response the errors
    res.status(403).json({
      errors: mappedErrors,
    });
  }
};

module.exports = {
  addUserValidators,
  addUserValidationHandler,
};
