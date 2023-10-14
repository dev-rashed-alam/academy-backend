const { check } = require("express-validator");

const doLoginValidators = [
  check("email").isEmail().withMessage("Invalid email address"),
  check("password").isLength({ min: 3 }).withMessage("Password is required!"),
];

const doPasswordChangeValidators = [
  check("oldPassword").notEmpty().withMessage("Old password is required!"),
  check("password").notEmpty().withMessage("Password is required!"),
  check("confirmPassword").notEmpty().withMessage("Confirm password is required!"),
];

module.exports = {
  doLoginValidators,
  doPasswordChangeValidators
};
