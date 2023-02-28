const { check } = require("express-validator");

const doLoginValidators = [
  check("email").isEmail().withMessage("Invalid email address"),
  check("password").isLength({ min: 3 }).withMessage("Password is required!"),
];

module.exports = {
  doLoginValidators,
};
